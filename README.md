# Liri Node Application

Liri is a command-line application that returns information about artist, songs, and movies.

## Installation

Use the node.js package manager to install requisite packages. To call the Spotify API, users must
obtain and call their own Spotify key and client secret within "liri.js".

```bash
npm install
```
## Languages

javascript

## Resources

Liri utilizes the Spotify API and node.js, as well as the axios and inquirer packages for node.

## Usage

Liri can search for information about movies, songs, or upcoming concerts. 

Valid commands:

```bash

concert-this
spotify-this
movie-this
help

```

Type an action in the command line directly followed by the terms of the request.


EXAMPLE:

```bash
$ node liri.js spotify-this I am a Scientist
this is loaded...

Artist: Guided By Voices
Track: I Am A Scientist
Preview: https://p.scdn.co/mp3-preview/88836c81a1342d21aa07701076bb3acfd171e341?cid=852a579ae74446c184376c89a842ea7e
Album: Bee Thousand

```


