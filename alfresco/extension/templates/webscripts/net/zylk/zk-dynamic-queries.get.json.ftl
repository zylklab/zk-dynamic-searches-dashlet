{
  "queries":
    [
    <#if queries??>
	    <#list queries as query>
          <#if query.properties.description != "">
	      {
	
	       "queryName": "${query.name}",
	       "queryType": "${query.properties.description!''}"
	
	      }<#if query_has_next>,</#if>
          </#if>
	     </#list>
    </#if>		
    ]  
}