<#setting url_escaping_charset='UTF-8'>
<#macro dateFormat date=""><#if date?is_date>${xmldate(date)}</#if></#macro>
{
  "items":
    [		
     <#list items as item>

      <#assign node = item.node>
      <#assign version = "1.0">
      {	    
      
            
       "version": <#if node.hasAspect("cm:versionable")>"${node.properties["cm:versionLabel"]}"<#else>"${version}"</#if>,
       "nodeRef": "${node.nodeRef}",
       "nodeType": "${node.typeShort}",
       "type": "${node.type}",
       "mimetype": "${node.mimetype!""}",
       "isFolder": ${node.isContainer?string},
       "fileName": "${node.name}",   
       "displayName": "${node.name}",  
       "title": <#escape x as jsonUtils.encodeJSONString(x)> "${node.properties.title!""}"</#escape>,
       "description":  <#escape x as jsonUtils.encodeJSONString(x)> "${node.properties.description!""}"</#escape>,
       "author": "${node.properties.author!""}",
       "createdOn": "<@dateFormat node.properties.created />",
       "createdBy": "${node.properties.creator}",
       "createdByUser": "${node.properties.creator}",
       "modifiedOn": "<@dateFormat node.properties.modified />",
       "modifiedBy": "${node.properties.modifier}",
       "modifiedByUser": "${node.properties.modifier}",      
       "categories":  <#if node.hasAspect("cm:generalclassifiable")>[<#list node.properties.categories![] as c>["${c.name}", "${c.displayPath?replace("/categories/General","")}"]<#if c_has_next>,</#if></#list>]<#else>[]</#if>,
       "tags":  <#if item.tags?exists>[<#list item.tags as tag>"${tag}"<#if tag_has_next>,</#if></#list>]<#else>[]</#if>,         
       "size": "${node.size?c}",  
       "contentUrl": "api/node/content/${node.storeType}/${node.storeId}/${node.id}/${node.name?url}",
       "webdavUrl": "${node.webdavUrl}",
       "location":
	   {
	      "repositoryId": "${(node.properties["trx:repositoryId"])!(server.id)}",
	      "site": "${item.location.site!""}",
	      "siteTitle": "${item.location.siteTitle!""}",
	      "container": "${item.location.container!""}",
	      "path": "${item.location.path!""}",
	      "file": "${item.location.file!""}"
	      
	   }
        
      }<#if item_has_next>,</#if>
     </#list>
    ]  
}
