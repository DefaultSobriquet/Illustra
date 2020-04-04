module.exports = {
	"env": {
		"node": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	},
	"rules": {
		"comma-dangle": [
			"error",
			"never"
		],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"dot-location": [
			"error",
			"property"
		],
		"eqeqeq": [
			"error",
			"smart"
		],
		"key-spacing": [
			"error",
			{
				"afterColon": true
			}
		],
		"no-multi-spaces": "error",
		"comma-spacing": ["error", { "before": false, "after": true }]
	}
};