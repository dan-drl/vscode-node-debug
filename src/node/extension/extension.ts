/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';

import { NodeConfigurationProvider } from './configurationProvider';
import { LoadedScriptsProvider, pickLoadedScript, openScript } from './loadedScripts';
import { pickProcess, attachProcess } from './processPicker';
import { Cluster } from './cluster';

export function activate(context: vscode.ExtensionContext) {

	// register a configuration provider
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('node', new NodeConfigurationProvider(context)));

	// toggle skipping file action
	context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.toggleSkippingFile', toggleSkippingFile));

	// process picker command
	context.subscriptions.push(vscode.commands.registerCommand('extension.pickNodeProcess', pickProcess));

	// attach process command
	context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.attachNodeProcess', attachProcess));

	// loaded scripts
	vscode.window.registerTreeDataProvider('extension.node-debug.loadedScriptsExplorer', new LoadedScriptsProvider(context));
	context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.pickLoadedScript', pickLoadedScript));
	context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.openScript', (session: vscode.DebugSession, source) => openScript(session, source)));

	// cluster
	context.subscriptions.push(vscode.debug.onDidStartDebugSession(session => Cluster.startSession(session)));
	context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(session => Cluster.stopSession(session)));
}

export function deactivate() {
}


//---- toggle skipped files

function toggleSkippingFile(res: string | number): void {

	let resource: string | number | undefined = res;

	if (!resource) {
		const activeEditor = vscode.window.activeTextEditor;
		resource = activeEditor && activeEditor.document.fileName;
	}

	if (resource && vscode.debug.activeDebugSession) {
		const args = typeof resource === 'string' ? { resource } : { sourceReference: resource };
		vscode.debug.activeDebugSession.customRequest('toggleSkipFileStatus', args);
	}
}
