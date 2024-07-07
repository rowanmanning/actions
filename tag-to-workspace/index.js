'use strict';

const { EOL } = require('node:os');
const { join: joinPath } = require('node:path');
const { appendFileSync: appendFile } = require('node:fs');

const cwd = process.env.GITHUB_WORKSPACE || process.cwd();
const outputPath = process.env.GITHUB_OUTPUT || joinPath(cwd, 'output.txt');
const tagName = process.env.INPUT_TAGNAME;
const tagRegExp =
	/^(.+)-(v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;

// If we don't have a tag then there's no point continuing
if (!tagName) {
	process.stdout.write(`::error::No tag provided${EOL}`);
	process.exit(1);
}

// Check whether the tag is valid. If it's not then we don't
// error, we just warn that the tag is invalid and set output
const matches = tagName.match(tagRegExp);
if (!matches) {
	process.stdout.write(`::warning::Tag could not be parsed into a workspace${EOL}`);
	writeOutput({
		isValid: '',
		version: '',
		workspace: ''
	});
	process.exit(0);
}

const [, prefix, version] = matches;

// We need the package-lock to work out which workspace the
// prefix corresponds to
try {
	const packageLock = require(joinPath(cwd, 'package-lock.json'));
	if (typeof packageLock?.packages !== 'object') {
		throw new Error('package-lock.json does not have a `packages` property');
	}
	const workspace = Object.entries(packageLock.packages).find(([path, pkg]) => {
		if (path.startsWith('node_modules/')) {
			return false;
		}
		if (typeof pkg?.name !== 'string') {
			return false;
		}
		return pkg.name === prefix || pkg.name.endsWith(`/${prefix}`);
	});

	// If we have a single workspace, great!
	if (workspace) {
		process.stdout.write(`::notice::Tag corresponds to the ${workspace[0]} workspace${EOL}`);
		writeOutput({
			isValid: 'true',
			version,
			workspace: workspace[0]
		});
		process.exit(0);
	}

	// We don't have a workspace
	process.stdout.write(`::warning::No matching workspace was found${EOL}`);
	writeOutput({
		isValid: '',
		version: '',
		workspace: ''
	});
	process.exit(0);
} catch (_error) {
	process.stdout.write(`::error::Package lock could not be loaded/parsed${EOL}`);
	writeOutput({
		isValid: '',
		version: '',
		workspace: ''
	});
	process.exit(1);
}

/**
 * @param {{[key: string]: string}} data
 */
function writeOutput(data) {
	const dataString = Object.entries(data)
		.map(([key, value]) => `${key}=${value}`)
		.join(EOL);
	appendFile(outputPath, `${dataString}${EOL}`, { encoding: 'utf-8' });
}
