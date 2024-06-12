## [1.1.9] - 2024-06-12

### Added

- The `!deposit`, `!withdraw` and `!bank` commands

### Changed

- You now only steal half of someone else's money if you get the 1% chance on the `!steal` command
- Fixed the 1% chance triggering if the generated random number is 0
- Numbers are now properly formatted
- Improved the response from the `!temp`, `!choose` and `!ping` commands
- More reponses have been added to commands
- You can now retrieve the banner of bots since that functionality has been added to the Discord API
- Fixed a couple of inconsistencies in strings and variable names
- The database tables are now synced asynchronously

## [1.1.8] - 2024-06-11

### Changed

- The cash limit for the `!flip` command has been raised to 1000

## [1.1.7] - 2024-06-10

### Added

- The `!luck` command

### Changed

- Improved the `!help` command, it now uses pages listing command names with their descriptions which looks nicer on mobile and is more functional
- The `!daily` command's cooldown has been lowered to 12 hours from 1 day
- You can no longer steal if you're at the top of the leaderboard

## [1.1.6] - 2024-06-09

### Added

- Added the `!rps` command
- Added the `!kill` and `!revive` commands (moderators only)
- Added the `!add` and `!remove` commands (owner only)

### Changed

- The `!flip` command now tells you how much you gained instead of won total
- Removed multipliers with decimal points from the `!flip` command
- You can now only gamble up to 500 cash using the `!flip` command
- Economy commands now require whole numbers
- Fixed a bug where some commands wouldn't properly grant new members 100 cash
- Improved the random number generation algorithm
- Improved the calculation of random chances
- Improved the response from the `!choose` command

## [1.1.5] - 2024-06-08

### Added

- The `!daily` command

### Changed

- Cooldowns no longer apply if the command doesn't finish it's primary function
- Fixed a typo in the `!flip` command
- The `!flip` command now has an alias of `!f`

## [1.1.4] - 2024-06-07

### Changed

- Stealing no longer puts people in debt (oops)
- Infinite money stealing exploit fixed (oops)

## [1.1.3] - 2024-06-07

### Added

- The `!balance`, `!leaderboard`, `!secondchance`, `!give` and `!steal` commands
- You periodically gain 20 cash just for talking in the server
- More command categories

### Changed

- The `!flip` command can now be used to gamble money, everyone starts out with 100
- The command to convert temperatures is now `!temp`
- You can no longer check the time or time zone of bots

## [1.1.2] - 2024-06-05

### Added

- Added a banner for the test bot's profile page
- Added the `!temps`, `!time`, `!timezone` and `!settimezone` commands

### Changed

- Improved the bot's status message
- Improved response messages all across the board

### Removed

- The license file

## [1.1.1] - 2024-06-04

### Added

- Added a trailing newline in files that didn't have them
- Added a banner for the bot's profile page

### Changed

- Updated the server's name in the `README.md` file
- Updated the dependencies to the latest versions
- Updated the license to current year 2024
- Updated the config file template to match the current server theme

## [1.1.0] - 2023-10-24

### Added

- The `!furrytest` and `!gaytest` commands now add snarky remarks at certain percentages
- The `!gaytest` command now has a special message if you check aiden or the bot's percentage
- New `!flip`, `!choose` and `!rng` commands
- Added more information to the `!about` command
- Added the `src/utilities/commonMessages.js` script with functions that are re-usable for common messages (e.g. usage examples)
- Moderation commands now use embeds in success responses
- Members can't evade mutes anymore

### Changed

- Grammatical fixes in the README.md, changelog and command files
- Updated dependencies to the latest versions
- Updated config file to match the new server revamp naming scheme
- Updated the bot's status to better reflect how Mr. Wolf views his gang
- The bot now sends messages to the channel rather than replying with the responses to members directly
- 8-ball command no longer validates if it's getting asked a question
- Updated one of the responses from the 8-ball command
- Commands where you mention a user will no longer mention them again in the bot's message
- Commands with image attachments now send them in embeds
- The `!ping` command now has nicer formatting
- The `!help` command now alerts you if hidden commands are being shown
- The `!help` command now shows you commands from the "Secret" category if you are a bot owner
- The `!avatar` command can now send the user avatar if prefixed with the letter "g" (e.g. `!gavatar`)

### Removed

- Unused dependencies
- The `!gaytest` command sending a video if you check the bot's percentage
- `!kill` and `!revive` commands

## [1.0.2] - 2023-09-20

### Added

- `!gaytest` and `!furrytest` commands
- `!kill` and `!revive` commands (moderator only)
- A database that contains a table to store the names of members who have been killed by the bot

## [1.0.1] - 2023-08-18

A small update to add a few more features to the bot and tweak some commands

### Added

- A simple README.md file
- An alternate avatar for the development bot account
- New members will now automatically receive the "guest" role upon accepting the rules at the Membership Screening
- The 8-ball command! You can ask it yes or no questions to get varying answers

### Changed

- The prefix for commands is now loaded from the configuration file
- Tweaked the help command to include the prefix next to command names
- The help command will no longer respond if you try to fetch information about a command that doesn't exist

## [1.0.0] - 2023-08-18
  
Initial release of the project! 🎉
