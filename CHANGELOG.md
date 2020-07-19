# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/DefaultSobriquet/Illustra/compare/v1.1.0...v1.2.0) (2020-07-19)


### Features

* **command:** implement cooldowns for commands (default 2s) ([75f6d00](https://github.com/DefaultSobriquet/Illustra/commit/75f6d006d4e071ef8f936c79d52211a4cc5aac0a))
* **illustraclient:** bind emote manager to the IllustraClient managers property ([b7c6c0e](https://github.com/DefaultSobriquet/Illustra/commit/b7c6c0e126f4b152f129613d73754e38d2c97309))
* **info:** add a version number from package.json to info/status ([75706de](https://github.com/DefaultSobriquet/Illustra/commit/75706deb6e31977889811fef05a45b84eb577646))
* **mongodb:** add a basic user manager for later user ([21b1d54](https://github.com/DefaultSobriquet/Illustra/commit/21b1d5435638a75fbb6196c036d169996ce145f2))
* **remove:** update to allow the removal of multiple emotes at once ([6b26e0e](https://github.com/DefaultSobriquet/Illustra/commit/6b26e0ea762744d92df5f336bb4b89699d8b6933))
* **reputation:** add EmoteManager and properties for reputation in UserManager ([210090b](https://github.com/DefaultSobriquet/Illustra/commit/210090b6f5c6d25eada4b23f7a98bd5a7cf71122))
* **social:** intialize social module (profile, reputation) ([b6485b4](https://github.com/DefaultSobriquet/Illustra/commit/b6485b49169034c49ac9993f8dd247ad68ae7e44))
* **spotify:** add a flag providing a URI protocol to open the Spotify track ([b703c82](https://github.com/DefaultSobriquet/Illustra/commit/b703c82c393ec60726554ac1f935d46214ec3bdf))
* **userinfo:** add acks for users ([f51268e](https://github.com/DefaultSobriquet/Illustra/commit/f51268e783de7113e0df610284a816269dc6e7b8))


### Bug Fixes

* **emotes:** fix misnamed classes and process' default arguments for blur/pixelate ([c210602](https://github.com/DefaultSobriquet/Illustra/commit/c210602257009ec5784478a541b43d7ef61c01d4))
* **flip:** fix a prioritization issue for subcommand registration ([01c1f59](https://github.com/DefaultSobriquet/Illustra/commit/01c1f595242cd266e622d21b86a9f7895a88a85c))
* **obtain:** update extract to allow emotes to have duplicate ([33cc570](https://github.com/DefaultSobriquet/Illustra/commit/33cc5703c3d8be7271d013b04b1b0e1ed64ae8c9))
* **reload:** fix returning CommandResponse, minor punctuation error ([1435388](https://github.com/DefaultSobriquet/Illustra/commit/1435388f5a58c098b7ca8279796a5c831e76cd06))
* **userinfo:** fix a minor undefined check for acks ([42b55fa](https://github.com/DefaultSobriquet/Illustra/commit/42b55fa19be33ead976e949edb439fc3935966d7))

## [1.1.0](https://github.com/DefaultSobriquet/Illustra/compare/v1.0.0...v1.1.0) (2020-07-14)


### Features

* **obtain:** obtain now has the ability to take a message link for searching ([f5ea068](https://github.com/DefaultSobriquet/Illustra/commit/f5ea068031a4c8abb4dd93a1a1a62f9a87605dd9))
* **utils:** added a message parsing util for Discord links ([362682d](https://github.com/DefaultSobriquet/Illustra/commit/362682d37ffc59165e67c859801fe5224d7883d9))


### Bug Fixes

* **static emote processing:** fixed an issue with default arguments for emote processing ([8c6cd55](https://github.com/DefaultSobriquet/Illustra/commit/8c6cd557aa29f3f1e28ff191bd1fbd6404c4e9e9))
