//>>excludeStart("hbtExclude", pragmas.hbtExclude);
/**
 * @license RequireJS text 1.0.2 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
	define: false, window: false, process: false, Packages: false,
	java: false, location: false */

(function () {
		var xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
				bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
				hasLocation = typeof location !== 'undefined' && location.href,
				defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
				defaultHostName = hasLocation && location.hostname,
				defaultPort = hasLocation && (location.port || undefined),
				buildMap = [];

		define(['libs/handlebars'], function (Handlebars) {
				var text, get, fs;

				if (typeof window !== "undefined" && window.navigator && window.document) {
						get = function (url, callback) {
								var xhr = new XMLHttpRequest();
								xhr.open('GET', url, true);
								xhr.onreadystatechange = function (evt) {
										//Do not explicitly handle errors, those should be
										//visible via console output in the browser.
										if (xhr.readyState === 4) {
												callback(xhr.responseText);
										}
								};
								xhr.send(null);
						};
				} else if (typeof process !== "undefined" &&
								 process.versions &&
								 !!process.versions.node) {
						//Using special require.nodeRequire, something added by r.js.
						fs = require.nodeRequire('fs');

						get = function (url, callback) {
								callback(fs.readFileSync(url, 'utf8'));
						};
				} 

				text = {
						version: '1.0.2',

						jsEscape: function (content) {
								return content.replace(/(['\\])/g, '\\$1')
										.replace(/[\f]/g, "\\f")
										.replace(/[\b]/g, "\\b")
										.replace(/[\n]/g, "\\n")
										.replace(/[\t]/g, "\\t")
										.replace(/[\r]/g, "\\r");
						},

						get: get,

						/**
						 * Parses a resource name into its component parts. Resource names
						 * look like: module/name.ext!strip, where the !strip part is
						 * optional.
						 * @param {String} name the resource name
						 * @returns {Object} with properties "moduleName", "ext" and "strip"
						 * where strip is a boolean.
						 */
						parseName: function (name) {
								var index = name.indexOf("."),
										modName = name.substring(0, index),
										ext = name.substring(index + 1, name.length);

								return {
										moduleName: modName,
										ext: ext
								};
						},

						xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

						/**
						 * Is an URL on another domain. Only works for browser use, returns
						 * false in non-browser environments. Only used to know if an
						 * optimized .js version of a text resource should be loaded
						 * instead.
						 * @param {String} url
						 * @returns Boolean
						 */
						useXhr: function (url, protocol, hostname, port) {
								var match = text.xdRegExp.exec(url),
										uProtocol, uHostName, uPort;
								if (!match) {
										return true;
								}
								uProtocol = match[2];
								uHostName = match[3];

								uHostName = uHostName.split(':');
								uPort = uHostName[1];
								uHostName = uHostName[0];

								return (!uProtocol || uProtocol === protocol) &&
											 (!uHostName || uHostName === hostname) &&
											 ((!uPort && !uHostName) || uPort === port);
						},

						finishLoad: function (name, content, onLoad, config) {
								if (config.isBuild) {
										buildMap[name] = content;
								}
								onLoad(Handlebars.compile(content));
						},

						load: function (name, req, onLoad, config) {
								//Name has format: some.module.filext!strip
								//The strip part is optional.
								//if strip is present, then that means only get the string contents
								//inside a body tag in an HTML string. For XML/SVG content it means
								//removing the <?xml ...?> declarations so the content can be inserted
								//into the current doc without problems.

								// Do not bother with the work if a build and text will
								// not be inlined.

								if (config.isBuild && !config.inlineText) {
										onLoad();
										return;
								}

								var parsed = text.parseName(name),
										nonStripName = parsed.moduleName + '.' + parsed.ext,
										url = req.toUrl(nonStripName),
										useXhr = (config && config.text && config.text.useXhr) ||
														 text.useXhr;

								//Load the text. Use XHR if possible and in a browser.
								if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
										text.get(url, function (content) {
												text.finishLoad(name, content, onLoad, config);
										});
								}
						},

						write: function (pluginName, moduleName, write, config) {
							var options = {
								knownHelpers: {},
								knownHelpersOnly: true
							};
	
								if (moduleName in buildMap) {
										// var content = text.jsEscape(buildMap[moduleName]);
										var content = Handlebars.precompile(buildMap[moduleName], options);
										write.asModule(pluginName + "!" + moduleName,
																	 "define(['libs/handlebars'], function (Handlebars) { return Handlebars.VM.template(" +
																			 content +
																	 ");});\n");
								}
						},

						writeFile: function (pluginName, moduleName, req, write, config) {
								var parsed = text.parseName(moduleName),
										nonStripName = parsed.moduleName + '.' + parsed.ext,
										//Use a '.js' file name so that it indicates it is a
										//script that can be loaded across domains.
										fileName = req.toUrl(parsed.moduleName + '.' +
																				 parsed.ext) + '.js';

								//Leverage own load() method to load plugin value, but only
								//write out values that do not have the strip argument,
								//to avoid any potential issues with ! in file names.
								text.load(nonStripName, req, function (value) {
										//Use own write() method to construct full module value.
										//But need to create shell that translates writeFile's
										//write() to the right interface.
										var textWrite = function (contents) {
												return write(fileName, contents);
										};
										textWrite.asModule = function (moduleName, contents) {
												return write.asModule(moduleName, fileName, contents);
										};

										text.write(pluginName, nonStripName, textWrite, config);
								}, config);
						}
				};
				return text;
		});
}());
//>>excludeEnd("hbtExclude");
