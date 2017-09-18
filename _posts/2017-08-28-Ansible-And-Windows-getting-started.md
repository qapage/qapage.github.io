---
layout: post
title: Getting started with Ansible and Windows
categories: [automation]
tags: [automation]
---

#### What is the problem we're trying to solve?
I have around 10 different supported Windows versions. I'll need to run some tests against each of them. I looked into Ansible for setting up the boxes instead of setting up each box by hand. This blog documents what I learn as I go through this process. Let me know what you think!

#### Tools we're going to use
The tools we are going to use to get this done are [Vagrant](https://www.vagrantup.com/) and [Ansible](http://docs.ansible.com/)

##### Vagrant
Vagrant provides the same, easy workflow regardless of your role as a developer, operator, or designer. It leverages a declarative configuration file which describes all your software requirements, packages, operating system configuration, users, and more.  Read more at [Vagrant](https://www.vagrantup.com/).

##### Ansible
Ansible is a simple, agentless and powerful open source IT automation framework. Read more here at [Ansible](http://docs.ansible.com/)

#### Ok, lets do this!
The step by step instructions are as listed below, at the end of which you will have one Ansible control machine and a Windows machine that you will interact with via Ansible. You should be able to take this approach and extend it to any number of Windows hosts you want to work with.

##### Create a Vagrantfile with the below contents,

```
# vi: set ft=ruby :

# -*- mode: ruby -*-
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

Install the python dependencies via the below. You first put all the dependencies into a file called 'requirements.txt' and then use that file with pip install -r to get all the requirements installed.

```
cat <<END > requirements.txt
ansible
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

You typically create a directory, thats named after your project, 'ansiblecode' in this case, to contain your files. The inventory.yml contains the list of hosts that you need to run ansible actions on. The ansible.cfg file is the config file that tells ansible where to find the inventory file. You create a group_vars directory, that contains detailed definitions of the group or hosts you are trying to work with.

```
vagrant@ansible:~$ cat ansiblecode/
ansible.cfg    group_vars/    inventory.yml

vagrant@ansible:~$ cat ansiblecode/inventory.yml
[windows]
win2012r2

vagrant@ansible:~$ cat ansiblecode/ansible.cfg
[defaults]
inventory = /home/vagrant/ansibletesting/inventory.yml

vagrant@ansible:~/ansiblecode$ cat group_vars/windows.yml
ansible_user: vagrant
ansible_password: vagrant
ansible_port: 5985
ansible_connection: winrm
ansible_winrm_scheme: http
ansible_winrm_server_cert_validation: ignore
ansible_become: false

Add the windows machines you want to work with to your hosts file
vagrant@ansible:~/ansible_code$ cat /etc/hosts
127.0.0.1       ansible ansible
127.0.0.1       localhost
127.0.1.1       vagrant
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
192.168.2.6     win2012r2
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

##### Extending this into playbooks
Because most of the stuff we do, most of the setup that is needed, is
not really one off. We need a series of steps. Here's a sample playbook
that helps start off down that path.

```
vagrant@ansible:~/ansiblecode$ cat playbook.yml
- name: This is a simple test playbook
  hosts: all
  tasks:
    - name: run ipconfig
      raw: ipconfig
      register: ipconfig
    - debug: var=ipconfig
```

Then you run the playbook as expect to see output like this,
```
vagrant@ansible:~/ansible_code$ ansible-playbook -s playbook.yml

PLAY [This is a simple test playbook] 

TASK [Gathering Facts] 
ok: [win2012r2]

TASK [run ipconfig] 
changed: [win2012r2]

TASK [debug] 
ok: [win2012r2] => {
    "ipconfig": {
        "changed": true,
        "rc": 0,
        "stderr": "",
        "stdout": "\r\nWindows IP Configuration\r\n\r\n\r\nEthernet adapter Ethernet 2:\r\n\r\n   Connection-specific DNS Suffix  . : \r\n   Link-local IPv6 Address . . . . . : fe80::940e:854c:d30:ce8b%16\r\n   IPv4 Address. . . . . . . . . . . : 192.168.2.6\r\n   Subnet
Mask . . . . . . . . . . . : 255.255.255.0\r\n   Default Gateway . . . . . . . . . : \r\n\r\nEthernet adapter Ethernet:\r\n\r\n   Connection-specific DNS Suffix  . : \r\n   Link-local IPv6 Address . . . . . : fe80::f9f4:33db:8703:4244%12\r\n   IPv4 Address. . . . . . . .
. . . : 10.0.2.15\r\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n   Default Gateway . . . . . . . . . : 10.0.2.2\r\n\r\nTunnel adapter isatap.{380551EF-D345-4EA8-8323-39058D784E6D}:\r\n\r\n   Media State . . . . . . . . . . . : Media disconnected\r\n   Connect
ion-specific DNS Suffix  . : \r\n\r\nTunnel adapter isatap.{5178F18B-3F30-4D9D-8495-67D2F44DD5B1}:\r\n\r\n   Media State . . . . . . . . . . . : Media disconnected\r\n   Connection-specific DNS Suffix  . : \r\n",
        "stdout_lines": [
            "",
            "Windows IP Configuration",
            "",
            "",
            "Ethernet adapter Ethernet 2:",
            "",
            "   Connection-specific DNS Suffix  . : ",
            "   Link-local IPv6 Address . . . . . : fe80::940e:854c:d30:ce8b%16",
            "   IPv4 Address. . . . . . . . . . . : 192.168.2.6",
            "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
            "   Default Gateway . . . . . . . . . : ",
            "",
            "Ethernet adapter Ethernet:",
            "",
            "   Connection-specific DNS Suffix  . : ",
            "   Link-local IPv6 Address . . . . . : fe80::f9f4:33db:8703:4244%12",
            "   IPv4 Address. . . . . . . . . . . : 10.0.2.15",
            "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
            "   Default Gateway . . . . . . . . . : 10.0.2.2",
            "",
            "Tunnel adapter isatap.{380551EF-D345-4EA8-8323-39058D784E6D}:",
            "",
            "   Media State . . . . . . . . . . . : Media disconnected",
            "   Connection-specific DNS Suffix  . : ",
            "",
            "Tunnel adapter isatap.{5178F18B-3F30-4D9D-8495-67D2F44DD5B1}:",
            "",
            "   Media State . . . . . . . . . . . : Media disconnected",
            "   Connection-specific DNS Suffix  . : "
        ]
    }
}

PLAY RECAP 
win2012r2                  : ok=3    changed=1    unreachable=0    failed=0

vagrant@ansible:~/ansible_code$
```

##### Common errors
This is an error you'll see unless you add your windows machine's name
and IP to the ansible machine's hosts file.

```
ansible:~/ansible_code$ ansible windows -m win_ping
win2012r2 | UNREACHABLE! => {
    "changed": false,
        "msg": "plaintext: HTTPConnectionPool(host='win2012r2',
        port=5985): Max retries exceeded with url: /wsman (Caused by
        NewConnectionError('<urllib3.connection.HTTPConnection object at
        0x7
        f19bbb23e50>: Failed to establish a new connection: [Errno -2]
        Name or service not known',))",
            "unreachable": true
            }
```

This is an error that I kept getting until I added `ansible_become: false` to my group_vars/windows.yml file.

```
vagrant@ansible:~/ansiblecode$ ansible-playbook -s playbook.yml

PLAY [test raw module] 

TASK [Gathering Facts] 
fatal: [win2012r2]: FAILED! => {"failed": true, "msg": "Internal Error: this connection module does not support running commands via sudo"}
        to retry, use: --limit @/home/vagrant/ansiblecode/playbook.retry

PLAY RECAP 
win2012r2                  : ok=0    changed=0    unreachable=0    failed=1
```

