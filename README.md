# Custom Search Dashlet

This dashlet allows to configure complex Alfresco querys and filters in user and site panels. The dashlet has several operation options:
 - Mode 0: Just configuring filters such as path, categories, tags and mimetype. 
 - Mode 1: Selecting a saved query from Data Dictionary
 - Mode 2: Typing a Lucene query

## Mode 0: Just filter content by:
 - Document Type
 - Path
 - Multiple categories
 - Multiple tags
 - Mimetype

You may also limit the number of results and to order them by typical metadata (i.e: cm:modified and ascending or descending)

## Mode 1: Saved searches (disabled)

The custom search dashlet allows to have preconfigured searches in /Data Dictionary/Dynamic Queries folder. First, you need to create this folder where you can create subfolder-based structures, for defining sets of queries for different final users, using ACL permissions.
 - Group query 1 (folder)
   - Query 1 (folder):
 - Group query 2 (folder)
   - Query 2 (folder)

For Query 1:
 - Set folder name "Public and Shared"
 - Set folder description +ASPECT:\"qshare:shared\"

When available, the dashlet configuration shows a combo with the configured custom queries.

## Mode 2: Direct Lucene syntax (disabled)

TODO

## Packaging

You may pack it with jar command. Go into the directory that you unzipped, or cloned via git:

    $ git clone https://github.com/zylklab/zk-custom-search-dashlet
    $ cd zk-custom-search-dashlet
    $ jar -cf zk-custom-search-dashlet.jar *

## Installation

Install it, copying the corresponding jar into $TOMCAT/shared/lib and restart Alfresco service. 

## Using

You can use the dashlet in the user / site panels allowing to select one (or a group) of the defined custom searches in each dashlet.

## Extra configuration of the dashlet

You may add your custom content types in:

	alfresco/web-extension/site-webscripts/org/alfresco/modules/config-dynamic-searches.get.config.xml

## TODO

 [-] Enable Mode 1 (Saved searches)
 [-] Enable Mode 2 (Direct Lucene Syntax)
 [-] In mode 1: Use smart query syntax to save queries
 [-] In mode 1: Create Data Dictionary structure for Dynamic Queries (ACP bootstrap)
 [+] FIXED: Disabled modes 1 and 2
 [+] FIXED: Alphabetically mimetype values ordering
 [-] Use Alfresco Maven SDK 
 [-] Separate in two AMPs

## Links
 - http://www.zylk.net/es/web-2-0/blog/-/blogs/user-dashlets-for-quick-search-and-business-views-in-alfresco-share
 - http://www.zylk.net/es/web-2-0/blog/-/blogs/dashlet-de-busquedas-dinamicas-guardadas-by-zylk

## Tested

The dashlet should work in Alfresco 4.2 and above

## Authors

- Patricia Yague
- Irune Prado
- Cesar Capillas