# 🥗 Salad Bowl

Salad Bowl is a lively social party game that combines Taboo, Charades, and Password. I've also heard it called Fish Bowl, Celebrity, Moniker, etc. This app is a online adaptation so you can play with people remotely while in a video chat together. Thanks quarantine! 🙄 It's built with [React](https://github.com/facebook/react), [Socket.io](https://github.com/socketio/socket.io), [TypeScript](https://github.com/microsoft/TypeScript), [MongoDB](https://github.com/mongodb/mongo), and [Express](https://github.com/expressjs/express). 

## How To Play

Create a game by clicking `Create Game`. Complete the setup prompt and you'll be given a four-digit code which you'll share with your friends. They'll join by clicking, wait for it, `Join Game`. 

Everyone writes down a handful of short phrases, names, etc. You'll split up into teams and then take turns prompting your teammates to guess these phrases. You go through the "bowl" three times, each time with different prompting constraints. 

### Round 1 - Taboo
In the first round you can use any words other than what's on the phrase. Our house rules are generally lax for non-meaningful parts of the phrase, like the word "the", or "it" for example. We also play where once a particular word in the phrase has been guessed, the prompter is no longer barred from using that word in further explainations for the rest of the phrase. 

### Round 2 - Charades
In the second round you cannot use any words at all and are limited to acting. It's harder, but remember at this point you've all gone through the phrases once before, so you're not starting from scratch. We usually play where the prompter can also use sound effects as long as they aren't actual words. 

### Round 3 - Password
In the third and final round, you get just one single word. I've seen this played with varying levels of strictness, to the point where the prompter might utter an "Um..." and the other team gleefully insists that's the one word and the prompter blew it. I think that's overkill. Up to you.

## More Gameplay Details

#### Reviewing Turn Results
After your time is up, you can manually tell the game which phrases your team solved using the `Review My Results` button. This can be useful for a "buzzer beater" scenario when your teammates solve right at the last moment of the turn but you didn't push the `Solved` button in time. It can also be useful if you marked a phrase as solved but the team later decides it shouldn't count for some reason. 

#### Skipping Phrases
There is a "skip phrase" option for the prompter, but its use is heavily discouraged for the most part. If you really, truly do not know what a phrase means at all and are unable to prompt it, I guess you can use it but expect to take some shit for it, you pansy. This button is also more legitimately useful if you accidentally break the round's rules and need to disqualify this phrase for yourself and put it back into the bowl and keep going with your turn.


