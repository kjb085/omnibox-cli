## **Omnibox CLI**

A Chrome Extension that provides flexible, customizable command line interface for the Chrome Omnibox (URL bar) to help users to quickly build complex URLs and instruct the browser on when/where to open the resulting URL from a given command.

Functionality wise the MVP is complete, although it has yet to be packaged and listed in the Chrome store due to UI deficiencies. The target release is planned to occur upon the completion of a user friendly UI MVP.

**Basic Examples**
 - A user a can create a command `github` and associate the base URL `https://www.github.com`. Upon entering the command the current tab will navigate to `https://www.github.com`.
 - A user can create sub commands, such as self `self` meant to navigate to a user's own github page. For me, the URL piece I would associated would be `/kjb085` so running `github self` would result in `https://www.github.com/kjb085/`.
 - A user can create as many sub commands as needed. Let's say to just focus on a specific project such as MagicMirror2. A command `mm` could be created with the data piece `/MichMich/MagicMirror` thus `github mm` would navigate the user to `https://www.github.com/MichMich/MagicMirror`.
 - A user can also create sub commands that are more dynamic than addressing only hard coded URL pieces. A sub command `user` could be created that accepts input. Since the original URL piece does not end with a trailing `/` we'll need to associate one to the command and indicate that the user input should be appended. Upon doing so the command `github user michmich` would navigate to `https://www.github.com/MichMich`.
 - Additionally, there are global flags (listed below) which can modify the behavior of where the resulting URL is openned, such as in a new window. Taking our earlier example the command `github self --new-window` would, as expected, open a new browser window, with the only tab being `https://www.github.com/kjb085/`.

**Flags**
| Flag | Short Flag | Function |
|--|--|--|
| `--new-tab` | `-t` | Open command url in new tab |
| `--new-window` | `-w` | Open command url in new window |
| `--incognito` | `-i` | Open command url in a new incognito window |

More to be added

**To Do**
__In Progress__
 - Complete Vue.js based user interface allowing users to update all pieces of the data tree.
 - Add eslint

__Next Up__
 - Add page to display flags in options UI
 - Add testing
 - Add a section of the Vue.js based options page to allow users to test out commands to see the result during the editing phase
 - Explore ability to natively hook into bookmarks without user defining commands
 - Explore the idea of templating to allow for resuability of command "tree branches"
 - Migrate to TypeScript
 - Meta functionality to ominibox such as ability to add, update, and delete commands
 - Explore the possibility of adding an API or defining an interface to route commands to other Chrome extensions
