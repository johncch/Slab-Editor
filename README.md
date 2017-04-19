# Slab Editor

The goals of the Slab Editor is to create a cross-platform, consistent, and beautiful writing experience for the Web.

That said, this is a port of an editor I wrote for a now defunct project circa 2012, and because I liked it so much, decided to port it over to TypeScript. Originally, the project was created to address the challenges of ContentEditable based editors, specifically in it's original purpose of displaying a list. Since then, there's been a few outstanding web based editors, especially code editors, that came to market. My current intention is to create a modular, pluggable system that allows me to build beautiful writing tools.

## Usage

This project is not production ready. A demo is [available here](https://johncch.github.io/Slab-Editor/)

To run the code, simply clone the repository and `npm install` to acquire all the dependencies. You can then execute `npm run develop` to serve the code out of your local host.

## Current status

[4/18/17]

What I have here is a straightforward port of the old JavaScript code with certain parts refactored out into classes. There are tons of bugs with regards to the robustness of the selection model that needs to be addressed.

The next work item is to refactor out the rendering and measuring code into it's own separate module and simplify the model so it's easier to work with.

## License

MIT
