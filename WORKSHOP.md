# Pistachio Release Process Workshop

1\. Clone the repository:

    $ git clone --branch release-workshop https://github.com/graze/pistachio.git

2\. Release a new version of the application! See [README.md](README.md#Deploying) for the how-to.

    $ npm version -m ":mortar_board: Release version %s in the workshop." 0.0.1-workshop-$(whoami | perl -ne 'print lc')

3\. **Don't** open a PR for the release, but _do_ check out the build on [Travis CI](https://travis-ci.org/graze/pistachio/builds).

Congrats :tada:, you've just released a new version of pistachio!

The style sheet and javascript files have been uploaded to s3 and can be accessed through the CDN.

If you merged into master as well
the style guide would also be updated on Heroku. _As long as all the tests pass!_
