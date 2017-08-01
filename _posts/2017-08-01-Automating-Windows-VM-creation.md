---
layout: post
title: Automating Windows VM creation
categories: [automation]
tags: [automation]
---

#### What's the use case?
I need to run some tests against about 10 or so supported windows versions. I can either have these machines built (manually) once via VMWare or something like that and then take snapshots, do my tests and revert to the snapshots. Or I can create automation around spinning up these VM's and not worry about manually setting up these VM's ever. The latter approach is the subject of this post. I hope you find it useful.

#### Tools we're going to use
The tools we are going to use to acheive this objective are [Vagrant](https://www.vagrantup.com/), [boxcutter](https://atlas.hashicorp.com/boxcutter) and [Packer](https://www.packer.io/).

##### Vagrant
Vagrant provides the same, easy workflow regardless of your role as a developer, operator, or designer. It leverages a declarative configuration file which describes all your software requirements, packages, operating system configuration, users, and more.  Read more at [Vagrant](https://www.vagrantup.com/).
##### Boxcutter
Community-driven templates and tools for creating cloud, virtual machines, containers and metal operating system environments. Read more at [boxcutter](https://atlas.hashicorp.com/boxcutter).
##### Packer
Packer embraces modern configuration management by encouraging you to use automated scripts to install and configure the software within your Packer-made images. Packer brings machine images into the modern age, unlocking untapped potential and opening new opportunities. Read more at [Packer](https://www.packer.io/).

#### Let's dive in and do this
The step by step instructions are as listed below, at the end of which
you'll have a vagrant box ready to use.

```
git clone https://github.com/boxcutter/windows.git boxcutter-windows
make virtualbox/eval-win2012r2-standard
ls -lh box/virtualbox/eval-win2012r2-standard-nocm-1.0.4.box
vagrant box add box/virtualbox/eval-win2012r2-standard-nocm-1.0.4.box --name win2012r2-standard
```

#### What did we just do?
Lets go look at each individual step and understand what we did.

* The git clone step gives you the boxcutter tool and all the required json files to bring up pre-defined windows machines.
* The make step is responsible for downloading the right version of windows based on the kind of box you requested, installing everything you needed and creating a .box file for you to use with your Vagrantfile.
* The ls step shows you that where to find the box packaged per your specifications in the json file.
* The vagrant box add steps is responsible for importing the created .box file into vagrant and enabling vagrant to use that for building future boxes.
* Also create a Vagrantfile with the below contents and you should then be able to do a `vagrant up` and have your VM ready to use.

```
Vagrant.configure("2") do |config|
        config.vm.define "eval-win2012r2-standard" do |box|
    box.vm.box = "win2012r2-standard"
          box.vm.guest = :windows
                box.vm.communicator = "winrm"
        end
end
```
