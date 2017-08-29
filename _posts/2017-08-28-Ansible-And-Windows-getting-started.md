---
layout: post
title: Getting started with Ansible and Windows
categories: [automation]
tags: [automation]
---

#### Why do I need to work with Ansible on Windows?
I need to run some tests against about 10 or so supported windows versions. I can either have these machines built (manually) once via ESXi or something like that and then take snapshots, do my tests and revert to the snapshots. Or I can create automation around spinning up these VM's and not worry about manually setting up these VM's ever. The latter approach is the subject of this post. I hope you find it useful.

I'll need to run some tests against a bunch of different windows machines, one each for every supported version. I looked into Ansible for setting up the boxes instead of setting up each box by hand. This blog documents what I learn as I go through this process. Let me know what you think!

#### Tools we're going to use
The tools we are going to use to acheive this objective are [Vagrant](https://www.vagrantup.com/) and [Ansible](http://docs.ansible.com/)

##### Vagrant
Vagrant provides the same, easy workflow regardless of your role as a developer, operator, or designer. It leverages a declarative configuration file which describes all your software requirements, packages, operating system configuration, users, and more.  Read more at [Vagrant](https://www.vagrantup.com/).

##### Ansible
Ansible is a simple, agentless and powerful open source IT automation framework. Read more here at [Ansible](http://docs.ansible.com/)

#### Ok, lets do this!
The step by step instructions are as listed below, at the end of which you will have one Ansible control machine and a Windows machine that you will interact with via Ansible. You should be able to take this approach and extend it to any number of Windows hosts you want to work with.

##### Create a Vagrantfile with the below contents,

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
end

Vagrant.configure(2) do |config|
  config.vm.define "ansible" do |ctl|
    ctl.vm.box = "boxcutter/ubuntu1604"
    ctl.vm.hostname = "ansible"
    ctl.vm.network "private_network",ip: "192.168.2.5"
    ctl.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
    end
  end

  config.vm.define "win2012r2" do |ctl|
    ctl.vm.box = "win2012r2-standard"
    ctl.vm.hostname = "win2012r2"
    ctl.vm.network "private_network",ip: "192.168.2.6"
    ctl.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
    end
  end
end
```

##### Start up the vagrants you just defined
The commands to do this are,
```
MacBook-Pro:windows_ansible dbhaskaran$ vagrant status
Current machine states:

ansible                   running (virtualbox)
win2012r2                 running (virtualbox)

This environment represents multiple VMs. The VMs are all listed
above with their current state. For more information about a specific
VM, run `vagrant status NAME`.

vagrant up #this should start up the two boxes you defined and get them ready to work with
```

##### Prep the ansible box
Install the required dependencies via the below,
```
sudo apt-get update

sudo apt-get install python-pip

sudo apt-get install libssl-dev
```

Install the python dependencies via the below,
```
cat <<END > requirements.txt
ansible==2.4.0
asn1crypto==0.22.0
bcrypt==3.1.3
certifi==2017.7.27.1
cffi==1.10.0
chardet==3.0.4
cryptography==2.0.3
enum34==1.1.6
httplib2==0.10.3
idna==2.6
ipaddress==1.0.18
Jinja2==2.9.6
MarkupSafe==1.0
ntlm-auth==1.0.5
ordereddict==1.1
paramiko==2.2.1
pyasn1==0.3.3
pycparser==2.18
PyNaCl==1.1.2
pywinrm==0.2.2
PyYAML==3.12
requests==2.18.4
requests-ntlm==1.0.0
six==1.10.0
urllib3==1.22
xmltodict==0.11.0
END

pip install -r requirements.txt

```

##### Create files and directories per below
```
vagrant@ansible:~$ cat ansiblecode/
ansible.cfg    group_vars/    inventory.yml

vagrant@ansible:~$ cat ansiblecode/inventory.yml
[windows]
win2012r2

vagrant@ansible:~$ cat ansiblecode/ansible.cfg
[defaults]
inventory = /home/vagrant/ansibletesting/inventory.yml

vagrant@ansible:~$ cat ansiblecode/group_vars/windows.yml
ansible_user: vagrant
ansible_password: vagrant
ansible_port: 5985
ansible_connection: winrm
ansible_winrm_scheme: http
ansible_winrm_server_cert_validation: ignore
```

##### Prep the Windows box
Prepare the windows box via the below,

Open up the Firewall settings
![placeholder](/assets/images/firewall_settings.png)

Open the properties window and set incoming to "Allow"
![placeholder](/assets/images/firewall_properties.png)

##### Test run!
Lets try and see if we can run a sample command on the windows box. I'm going to go with the win__ping command.
```
vagrant@ansible:~/ansiblecode$ ansible windows -m win_ping
win2012r2 | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}
```
