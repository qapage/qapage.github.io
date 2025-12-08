## softwareled.com
### Setting up a local dev environment
* clone this repo, cd into it

* sudo gem install jekyll bundler
* vim Gemfile and add the below lines to it

```
source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins
```

* gem install bundler
* bundle install
* bundle install --path vendor/bundle #in case the previous line fails
* bundle exec jekyll serve
=======

Next  time just run `bundle exec jekyll serve`, and you should have a local instance running

        ## For all things Software Leadership related.
