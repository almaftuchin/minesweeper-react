# 💣[Minesweeper](https://minesweeper.lnmai.com/)

### [Rules of MineSweeper](https://gist.github.com/lionel-lints/1b520163e892bf7913f594bd76363ff8)

### Leaderboards
- Using Cheat - Defuse Mine 👀 will not count.
- Score will only be recorded if user's logged in - using Facebook login.

### Defuse Mine 👀
Easy win but meh

### Server code for Leaderboard
Using Heroku.
- Pros: fast and free.
- Cons: The Heroku filesystem is ephemeral - that means that any changes to the filesystem whilst the dyno is running only last until that dyno is shut down or restarted. Each dyno boots with a clean copy of the filesystem from the most recent deploy. Leaderboard will be reset. 😢 

### Plugins/Dependencies

| dependencies | Link |
| ------ | ------ |
| Moment  | https://www.npmjs.com/package/moment |
| React-bootstrap | https://react-bootstrap.github.io/ |
| React-facebook-login | https://www.npmjs.com/package/react-facebook-login |
| react-notifications | https://www.npmjs.com/package/react-notifications |
| gh-pages | https://www.npmjs.com/package/gh-pages |

### Todos
 - Level/Difficulty
