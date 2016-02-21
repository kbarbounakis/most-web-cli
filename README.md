most-web-cli
============

![MOST Web Framework Logo](https://www.themost.io/assets/images/most_logo_sw_240.png)

A command line utility for [Most Web Framework](https://github.com/kbarbounakis/most-web) applications.

Usage
=====

##### Generate a new MOST Web Framework application

    most -o generate

##### Start a lite application server for static content

    most -o lite [-r <directory>] [-b <address>] [-p <port>]

Options

-r [directory] : The directory which contains the files to be served.
 This parameter is optional. The default value is the current directory.

-b [address]: The IP address to be bind. This parameter is optional. The default value is 0.0.0.0.

-p [port]: The port to be used for listening HTTP requests. This parameter is optional. The default value is 3000.

##### Migrate a data model

    most -o migrate -m <data model name>

##### Import data from a JSON file

    most -o import -m <data model name> -i <data file path>

##### Create an new data controller

    most -o controller-class -n <controller name>

This operation will generate a new controller and it will place it in controllers folder (app/controllers).

##### Create an new base controller

    most -o base-controller-class -n <controller name>

This operation will generate a new base controller and it will place it in controllers folder (app/controllers).

##### Create an new model class

    most -o model-class -n <model name>

This operation will generate a new model and it will place it in models folder (app/models).

##### Create an new model listener

    most -o model-listener -n <listener name>

This operation will generate a new model listener and it will place it in controllers folder (app/controllers).

