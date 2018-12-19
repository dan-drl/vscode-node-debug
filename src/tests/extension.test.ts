/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert = require('assert');
import processPicker = require('../node/extension/processPicker');

suite('Extensions',  () => {
	test.only('works', async () => {
		assert.equal(true, true);
		let x = await processPicker.listProcesses(true);
		console.log('procs', x);
		assert.notEqual(x, void 0);
	});
});
