## Yuman

[![Join the chat at https://gitter.im/seiyugi/yuman](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/seiyugi/yuman?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Yuman is a Firefox Add-on for displaying beautiful splash in the background of your Firefox new tab


### Development Environment Setup

[Please follow this guidline to install Firefox Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation)


### Quick Start for Development

* Clone this project `git clone git@github.com:seiyugi/yuman.git`

* Run with Add-on SDK

  ```sh
  $ cd yuman
  $ cfx run
  ```

### Create Install Package in xpi Format

  ```sh
  $ cfx xpi
  ```

  You'll get a file named `yuman.xpi`. Drag it into Firefox to install it.

### Collect pictures from https://unsplash.com/
  If you want to contribute your amazing pictures to yuman, please contact us debuguy@debuguy.org.