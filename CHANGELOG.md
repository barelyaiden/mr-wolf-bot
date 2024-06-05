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
