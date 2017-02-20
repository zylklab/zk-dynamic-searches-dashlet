<#assign id = args.htmlid>
<#assign jsid = args.htmlid?js_string>
<#assign prefSimpleView = preferences.simpleView!true>
<script type="text/javascript">//<![CDATA[
(function()
{
	var myDynamicSearches = new Alfresco.dashlet.MyDynamicSearches("${jsid}").setOptions({
         filterPath: "${filterPath}",
         defaultQuery: <#escape x as jsonUtils.encodeJSONString(x)>"${defaultQuery}"</#escape>,
         defaultQueryLabel: "${defaultQueryLabel}",
         customQuery: <#escape x as jsonUtils.encodeJSONString(x)>"${customQuery}"</#escape>,
         hideQueries : ${hideQueries},
         filterPathView: "${filterPathView}",
         maxItems : "${maxItems}",
         filterTags : "${filterTags}",
         filterCategories : "${filterCategories}",
         sort : "${sort}",
         sortOrder : "${sortOrder}",
         simpleView : ${prefSimpleView?string?js_string},
         validQueryFilter :  [<#list filterQueries as filter>{"label":"${filter.label?js_string}", "type":"${filter.type?js_string}"}<#if filter_has_next>,</#if></#list>],                  
         regionId : "${regionId}",
         containerId: "documentLibrary",
         componentId : "${instance.object.id}",
         siteId: "${instance.object.id}" || "",
         rootNode : "${rootNode}",
         title : "${title}",
         mimetype : "${mimetype}",
         contentType : "${contentType}"
   }).setMessages(${messages});


  	// actions + events
  	//----------------------
  	
   // resizer
   new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");
    
   // edit preferences
	var dynamicSearchesDashletEvent = new YAHOO.util.CustomEvent("onConfigDynamicSearchesClick");
  	dynamicSearchesDashletEvent.subscribe(myDynamicSearches.onConfigDynamicSearchesClick, myDynamicSearches, true);
  	
  	// fullScreen
  	var showFullscreenPageEvent = new YAHOO.util.CustomEvent("onConfigDynamicSearchesClick");
  	showFullscreenPageEvent.subscribe(myDynamicSearches.doShowFullscreenPage, myDynamicSearches, true);
  	
  	
   var actions = [];  

   if (!${hidePreferences} || ${isAdmin?string} ){
	   actions.push({
	     cssClass: "edit",
	     eventOnClick: dynamicSearchesDashletEvent,
	     tooltip: "${msg("dashlet.edit.tooltip")?js_string}"
	   });
	}
   
   actions.push({
      cssClass: "help",
      bubbleOnClick:
      {
         message: "${msg("dashlet.help")?js_string}"
      },
      tooltip: "${msg("dashlet.help.tooltip")?js_string}"
   });
   
   actions.push({
	      cssClass: "fullscreen",
	      eventOnClick: showFullscreenPageEvent,
          tooltip: "${msg("dashlet.fullscreen.tooltip")?js_string}" 
	   });

	new Alfresco.widget.DashletTitleBarActions("${jsid}").setOptions({
      actions: actions
    });
    
})();
//]]></script>

<div class="dashlet my-dynamic-searches">
   <div class="title" id="${id}-title">${msg("header")}</div>
   <div class="toolbar flat-button">
      <div class="hidden">
      
      	<div id="${id}-display-query">
	         <span class="align-left yui-button yui-menu-button" id="${id}-query">
	            <span class="first-child">
	               <button type="button" tabindex="0"></button>
	            </span>
	         </span>
         
	         <select id="${id}-query-menu">
				<#if customQuery == "" >
					<#list filterQueries as filter>
		            	<option value="${filter.type?html}">${filter.label}</option>
		         	</#list>
         		<#else>
         			<option value="${customQuery}">${customQuery}</option>
         		</#if>
	         </select>
         </div>
         
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
   <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      <div id="${id}-documents"></div>
   </div>
</div>
