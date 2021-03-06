/*
 * Copyright (c) 2015, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

var util = require('util');

var assert = require('assertive');
var _ = require('lodash');

var STALE_MESSAGE = /stale element reference/;

function visiblePredicate(shouldBeVisible, element) {
  return element && element.isVisible() === shouldBeVisible;
}

function visibleFailure(shouldBeVisible, selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) to %sbe visible.',
    timeout, selector, shouldBeVisible ? '' : 'not '));
}

// Curry some functions for later use
var isVisiblePredicate = _.partial(visiblePredicate, true);
var isntVisiblePredicate = _.partial(visiblePredicate, false);

var isVisibleFailure = _.partial(visibleFailure, true);
var isntVisibleFailure = _.partial(visibleFailure, false);

function elementExistsPredicate(shouldBeVisible, element) {
  return !!element === shouldBeVisible;
}

function elementExistsFailure(shouldBeVisible, selector, timeout) {
  throw new Error(util.format('Timeout (%dms) waiting for element (%s) %sto exist in page.',
    timeout, selector, shouldBeVisible ? '' : 'not '));
}

var elementDoesExistPredicate = _.partial(elementExistsPredicate, true);
var elementDoesNotExistPredicate = _.partial(elementExistsPredicate, false);

var elementDoesExistFailure = _.partial(elementExistsFailure, true);
var elementDoesNotExistFailure = _.partial(elementExistsFailure, false);

exports._forwarded = [
  // TODO: port type assertion for selector to webdriver-http-sync
  'getElements',
];

exports.getElementOrNull = function getElementOrNull(selector) {
  // TODO: part typeof selector === string check to webdriver-http-sync
  assert.hasType('`selector` as to be a String', String, selector);
  return this.driver.getElement(selector);
};

var warnAboutFutureException = util.deprecate(_.noop, [
  'WARNING:',
  'getElement was used with a selector that doesn\'t match an element.',
  'Use getElementOrNull if that\'s expected.',
  'In future versions of testium-driver-sync, getElement will throw.',
].join('\n'));

exports.getElement = function getElement(selector) {
  var element = this.getElementOrNull(selector);
  if (element === null) {
    warnAboutFutureException();
  }
  return element;
};

exports.getExistingElement = function getExistingElement(selector) {
  var element = this.getElementOrNull(selector);
  assert.truthy('Element not found at selector: ' + selector, element);
  return element;
};

exports.waitForElementVisible = function waitForElementVisible(selector, timeout) {
  return this._waitForElement(selector, isVisiblePredicate, isVisibleFailure, timeout);
};

exports.waitForElementNotVisible = function waitForElementNotVisible(selector, timeout) {
  return this._waitForElement(selector, isntVisiblePredicate, isntVisibleFailure, timeout);
};

exports.waitForElementExist = function waitForElementExist(selector, timeout) {
  return this._waitForElement(selector,
    elementDoesExistPredicate, elementDoesExistFailure, timeout);
};

exports.waitForElementNotExist = function waitForElementNotExist(selector, timeout) {
  return this._waitForElement(selector,
    elementDoesNotExistPredicate, elementDoesNotExistFailure, timeout);
};

exports.click = function click(selector) {
  return this.getExistingElement(selector).click();
};

function tryFindElement(self, selector, predicate, untilTime) {
  var element;

  while (Date.now() < untilTime) {
    element = self.getElementOrNull(selector);

    try {
      if (predicate(element)) {
        return element;
      }
    } catch (exception) {
      // Occasionally webdriver throws an error about the element reference being
      // stale.  Let's handle that case as the element doesn't yet exist. All
      // other errors are re thrown.
      if (!STALE_MESSAGE.test(exception.toString())) {
        throw exception;
      }
    }
  }
  return false;
}

// Where predicate takes a single parameter which is an element (or null) and
// returns true when the wait is over
exports._waitForElement = function _waitForElement(selector, predicate, failure, timeout) {
  assert.hasType('`selector` as to be a String', String, selector);
  timeout = timeout || 3000;

  this.driver.setElementTimeout(timeout);
  var foundElement = tryFindElement(this, selector, predicate, Date.now() + timeout);
  this.driver.setElementTimeout(0);

  if (foundElement === false) {
    return failure(selector, timeout);
  }

  return foundElement;
};
