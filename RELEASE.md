# Release Instructions

- Add a new draft release in GitHub.
- Describe the Release
- Update the CDN link in the README (@TODO: Automate?)
- Update the version in `bower.json` (@TODO: Automate?)
- `npm version 2.x.y`
- git push origin v2.x.y
- git push origin master
- Publish the release on GitHub (this will automatically `npm publish` it)
