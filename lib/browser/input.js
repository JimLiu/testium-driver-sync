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

var assert = require('assertive');
var _ = require('lodash');

exports.clear = function clear(selector) {
  assert.hasType('clear(selector) - requires (String) selector', String, selector);
  return this.getExistingElement(selector).clear();
};

exports.type = function type(selector) {
  var keys = _.toArray(arguments).slice(1);
  assert.hasType('type(selector, ...keys) - requires (String) selector', String, selector);
  assert.truthy('type(selector, ...keys) - requires keys', keys.length > 0);
  var element = this.getExistingElement(selector);
  return element.type.apply(element, keys);
};

exports.setValue = function setValue(selector) {
  var keys = _.toArray(arguments).slice(1);
  assert.hasType('setValue(selector, ...keys) - requires (String) selector', String, selector);
  assert.truthy('setValue(selector, ...keys) - requires keys', keys.length > 0);

  var element = this.getExistingElement(selector);
  element.clear();
  return element.type.apply(element, keys);
};
exports.clearAndType = exports.setValue;
