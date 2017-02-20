<#assign id = args.htmlid>
<#assign jsid = args.htmlid?js_string>
<#assign prefSimpleView = preferences.simpleView!true>
<script type="text/javascript">//<![CDATA[

(function(){

	var myDynamicSearches = new Alfresco.dashlet.MyDynamicSearches("${jsid}").setOptions({
		  title: "${title}",
          query : "${query}",
          filterPath: "${filterPath}",
          filterPathView: "${filterPathView}",
          maxItems : "${maxItems}",
          filterTags : "${filterTags}",
          filterCategories : "${filterCategories}",
          sort : "${sort}",
          sortOrder : "${sortOrder}",
          simpleView : "${simpleView}",
          regionId : "${regionId}",               
          validQueryFilter : "${validQueryFilter}",          
          siteId: "${siteId}",
          containerId: "${containerId}",
          rootNode: "${rootNode}",
          mimetype : "${mimetype}",
          contentType : "${contentType}"
          
   	}).setMessages(${messages});
   	
	   
	// resizer
   	new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");

})();
//]]></script>  
<div class="dashlet my-dynamic-searches"> 
     <div class="title" id="${id}-title">${msg("header")}</div>       
	 <div class="toolbar flat-button">
	    <div class="hidden">
	       <div id="${id}-simpleDetailed" class="align-right simple-detailed yui-buttongroup inline">
	          <span class="yui-button yui-radio-button simple-view<#if prefSimpleView> yui-button-checked yui-radio-button-checked</#if>">
	             <span class="first-child">
	                <button type="button" tabindex="0" title="${msg("button.view.simple")}"></button>
	             </span>
	          </span>
	          <span class="yui-button yui-radio-button detailed-view<#if !prefSimpleView> yui-button-checked yui-radio-button-checked</#if>">
	             <span class="first-child">
	                <button type="button" tabindex="0" title="${msg("button.view.detailed")}"></button>
	             </span>
	          </span>
	       </div>
	       <div class="clear"></div>
	    </div>
	 </div>
	 <div style="height:600px" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
	    <div id="${id}-documents">		
	    </div>
	 </div>
</div>