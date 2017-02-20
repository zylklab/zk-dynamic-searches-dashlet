<script type="text/javascript">//<![CDATA[

function changeQueryLabel(){


  var id = document.getElementById("el").value;  
  var defaultQuery = document.getElementById(id+"-defaultQuery");  
  var defaultQueryLabel = document.getElementById(id+"-defaultQueryLabel");

  //defaultQueryLabel.value = defaultQuery.options[defaultQuery.selectedIndex].innerHTML;
  defaultQueryLabel.value = "";
}

function changeSortOrder(){

	var id = document.getElementById("el").value;  
	var sortOrderList = document.getElementById(id+"-sortOrder-list");
	var sortOrder = document.getElementById(id+"-sortOrder");
	
	sortOrder.value = sortOrderList.options[sortOrderList.selectedIndex].value;
}

//]]></script>

<#assign el=args.htmlid?html>
<div id="${el}-configDialog" class="my-dynamic-searches-configDialog">
   <input id="el" name="el" type="hidden" value="${el}"/>
   <div class="hd">${msg("label.configure")}</div>
   <div class="bd">
      <form id="${el}-form" action="" method="POST">
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-title">${msg("label.title")}:</label></div>
            <div class="yui-u"><input id="${el}-title" type="text" name="title" value=""/>&nbsp;</div>
         </div>  
         
         <div class="yui-gd">
            <div class="yui-u">
                <input type="hidden" id="${el}-hideQueries" name="hideQueries" />
                <input type="hidden" name="defaultQuery" id="${el}-defaultQuery" value=""/>
                <input type="hidden" name="customQuery" id="${el}-customQuery" value=" " />
            </div>
         </div>
	     
	     <fieldset>
	     	<label>${msg("label.descFilters")}</label>
	     	
	     	<div class="yui-gd" style="margin-left:10px;">
	        	<div class="yui-u first"><label for="${el}-defaultQuery">${msg("label.type")}:</label></div>
	            <div class="yui-u">	               
	            	<select name="contentType" id="${el}-contentType">
	                	<#list filterTypes as filter>
	                    	<option value="${filter.value?html}">${msg(filter.label)}</option>
	                    </#list>
					</select>
	             </div>
	         </div>
	     	
	         <div class="yui-gd">
	         	<div class="yui-u first"><label for="${el}-filterPath">${msg("label.enterPath")}:</label></div>
	            <div class="yui-u">	
			     	<input id="${el}-filterPath" name="filterPath" value="" type="hidden" />
					<div id="${el}-filterPathView"></div>	 		
			 		<button id="${el}-selectFilterPath-button">${msg("label.selectFilterPath")}</button>
					<button id="${el}-clearFilterPath-button">${msg("label.clearFilter")}</button>				
				</div>	
		     </div>	     
	
	         
		     <div class="yui-gd">	
		     	<div class="yui-u first"><label for="${el}-maxItems">${msg("label.maxItems")}:</label></div>
	            <div class="yui-u">	
		     		<input id="${el}-maxItems" name="maxItems" value="" type="text" />
		     	</div>			
		     </div>
		     
		     <!-- Tags & Categories -->
		     <div class="yui-gd">
	            <div class="yui-u first"><label for="${el}-filterTagsSelector">${msg("label.filterTags")}:</label></div>
	            <input type="hidden" id="${el}-filterTags" name="filterTags"/>
	            <div class="yui-u" id="${el}-filterTagsSelector"></div>
	         </div>
	         
	         <div class="yui-gd">
	            <div class="yui-u first"><label for="${el}-filterCategoriesSelector">${msg("label.filterCategories")}:</label></div>
	            <input type="hidden" id="${el}-filterCategories" name="filterCategories"/>
	            <div class="yui-u" id="${el}-filterCategoriesSelector"></div>
	         </div>
	        
	        <div class="yui-gd">
	        	<div class="yui-u first"><label for="${el}-mimetype">${msg("label.mimetype")}:</label></div>
	            <div class="yui-u">
	            	<select id="${el}-mimetype" name="mimetype" value="">
	            	       <option value=""></option>
	                	<#list filterMimetypes as filter>
	                    	<option value="${filter.value?html}">${msg(filter.label)}</option>
	                    </#list>
					</select>
	             </div>
	         </div>
	        
			<div class="yui-gd">
	        	<div class="yui-u first"><label for="${el}-sort">${msg("label.sort")}:</label></div>
	            <div class="yui-u">
	            	<select id="${el}-sort" name="sort" value="">
	                	<#list filterSorting as filter>
	                    	<option value="${filter.value?html}">${msg(filter.label)}</option>
	                    </#list>
					</select>
	             </div>
	         </div>
	          <div class="yui-gd">
	            <div class="yui-u first"><label for="${el}-sortOrder">${msg("label.sortOrder")}:</label></div>
	            <div class="yui-u">
	            	<input id="${el}-sortOrder" name="sortOrder" type="hidden" value=""/>
	            	<select id="${el}-sortOrder-list" name="sortOrder-list" onChange="changeSortOrder();">
	            		<option value="desc">${msg("label.sortOrder.desc")}</option>
	            		<option value="asc">${msg("label.sortOrder.asc")}</option>            		
		           	</select>
	            </div>
	         </div>
	    </fieldset>
         
		<div class="yui-gd" style="margin:15px; text-align:right;">
			<span class="note" style="margin-left:5px;">(*) ${msg("warning.refresh")}</span>
		</div>
         
         <div class="bdft">
            <input type="submit" id="${el}-ok" value="${msg("button.ok")}" />
            <input type="button" id="${el}-cancel" value="${msg("button.cancel")}" />
         </div>
      </form>
   </div>
   <div id="${el}-selectFilterPath"></div>
</div>
