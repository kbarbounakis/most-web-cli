most-web-cli
============

![MOST Web Framework Logo](https://www.themost.io/assets/images/most_logo_sw_240.png)

A command line utility for [Most Web Framework](https://github.com/themost-framework/themost) applications.

Usage
=====

##### Generate a new MOST Web Framework application

    themost new project <project name>
    
This operation will create a new MOST Web Framework application. Execute:

    cd <project name> && npm i
    
to install dependencies.

##### Import data from a JSON file

    themost import <data file path> --model <data model name> [--dev]
    
##### Query data

Applies the specified OData query options against the defined data model and prints the result

    themost cat --model <data model name> [--dev] 
            [--filter=<filter option>] 
            [--select=<select option>]
            [--top=<top option>] 
            [--skip=<skip option>]
            [--count=<count option>]
            [--order=<order by option>]
            [--group=<group by option>]
            [--expand=<expand option>]


##### Create an new controller

    themost generate controller <controller name>

This operation will generate a new controller and it will place it in controllers folder (server/controllers).

##### Create an new model class

    themost generate model <model name>

This operation will generate a new model and it will place it in models folder (server/models).

##### Create an new model listener

    themost generate listener <listener name>

This operation will generate a new model listener and it will place it in listeners folder (server/listeners).

##### Create an new application service

    themost generate service <service name>

This operation will generate a new application service and it will place it in services folder (server/services).
