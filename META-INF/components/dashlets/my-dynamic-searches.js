/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Dashboard MyDynamicSearches component.
 *
 * @namespace Alfresco
 * @class Alfresco.dashlet.MyDynamicSearches
 */
(function()
{
   /**
    * YUI Library aliases
    */
 var $html = Alfresco.util.encodeHTML,
      $links = Alfresco.util.activateLinks,
      $userProfile = Alfresco.util.userProfileLink,
      $siteDashboard = Alfresco.util.siteDashboardLink,
      $combine = Alfresco.util.combinePaths,
      $relTime = Alfresco.util.relativeTime;

   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Selector = YAHOO.util.Selector;

   /**
    * Dashboard MyDynamicSearches constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.MyDynamicSearches} The new component instance
    * @constructor
    */
   Alfresco.dashlet.MyDynamicSearches = function MyDynamicSearches_constructor(htmlId)
   {
      Alfresco.dashlet.MyDynamicSearches.superclass.constructor.call(this, htmlId);
      this.configDialog = null;
      return this;
   };
   
   Alfresco.dashlet.MyDynamicSearches.generateFilterMarkup = function MyDynamicSearches_generateFilterMarkup(filter)
   {
      var filterObj = Alfresco.util.cleanBubblingObject(filter);
      return YAHOO.lang.substitute("{filterOwner}|{filterId}|{filterData}|{filterDisplay}", filterObj, function(p_key, p_value, p_meta)
      {
         return typeof p_value === "undefined" ? "" : window.escape(p_value);
      });
   };
   
   Alfresco.dashlet.MyDynamicSearches.generatePathMarkup = function MyDynamicSearches_generatePathMarkup(path, name)
   {
      return Alfresco.dashlet.MyDynamicSearches.generateFilterMarkup(
      {
         filterId: "path",
         filterData: $combine(path, name)
      });
   };

   YAHOO.extend(Alfresco.dashlet.MyDynamicSearches, Alfresco.component.SimpleDocList,
   {
	   PREFERENCES_MYDYNAMICSEARCHES_DASHLET: "org.alfresco.share.MyDynamicSearches.dashlet",
	   PREFERENCES_MYDYNAMICSEARCHES_DASHLET_FILTER_QUERY: "",      
       PREFERENCES_MYDYNAMICSEARCHES_DASHLET_VIEW: "",
       
       /****************************
        * @method hideQueries 
        ****************************/
       setHideQueries: function (){
   	      if (this.options.hideQueries){
   	    	  Dom.get(this.id + "-display-query").style.display = "none";
   	      }else{
   	    	  Dom.get(this.id + "-display-query").style.display = "block";
   	      }
       },
       
       
       
       /****************************
        * @method setQueries 
        ****************************/
       setQueries: function(){
  	      
    	// -- customQuery
    	//--------------------------------------
       	if (this.options.customQuery != ""){
     	   this.widgets.query.set("label", this.options.customQuery);
    	   this.widgets.query.value = this.options.customQuery;
    	   
    	   
       	// -- queries && defaultQuery
   	    //----------------------------------------
       	}else{
       		
       		// validQueryFilter
       		var query = this.options.query;
       		query = Alfresco.util.arrayContains(this.options.validQueryFilter, query) ? query : this.options.validQueryFilter[0];
       		if (query != undefined){
       			if(this.widgets.query){
       				this.widgets.query.set("label", query.label);
       				this.widgets.query.value = query.type;
       			}	 
       		}

       		      		
       		
       		var query = this.options.defaultQuery;
       		
       		if (query && this.widgets.query){
       			for (filterNum in this.options.validQueryFilter){
       				if (this.options.validQueryFilter[filterNum].label == this.options.defaultQueryLabel){
       					query = this.options.validQueryFilter[filterNum];
       				}
       			}
       			
       			this.widgets.query.set("label", query.label);
       			this.widgets.query.value = query.type;
       		}
       		
       	
       	}  
       },
   
   
       
      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function MyDynamicSearches_onReady()
      {

    	  /**
          * Preferences
          */
         this.PREFERENCES_MYDYNAMICSEARCHES_DASHLET_VIEW = this.PREFERENCES_MYDYNAMICSEARCHES_DASHLET + ".simpleView";

         // title
         //-----------
         this.buildTitle();	 
         
        
         // ======================
         //  Query filter
         // ======================
         
    	 // create Dropdown filter (en fullscreen no se crea)
    	 this.widgets.query = Alfresco.util.createYUIButton(this, "query", this.onFilterQueryChange,
         {
            type: "menu",
            menu: "query-menu",
            lazyloadmenu: false
         });        	 
         

         // -- queries + defaultQuery
         //--------------------------
    	 if (this.widgets.query != null){
    		 
    		 // queries
    		 this.setQueries();
    		 
	   	      // hideQueries
    		 this.setHideQueries();
    	 }
         
    	  	      
         // Detailed/Simple List button
         this.widgets.simpleDetailed = new YAHOO.widget.ButtonGroup(this.id + "-simpleDetailed");
         if (this.widgets.simpleDetailed !== null)
         {
            this.widgets.simpleDetailed.check(this.options.simpleView ? 0 : 1);
            this.widgets.simpleDetailed.on("checkedButtonChange", this.onSimpleDetailed, this.widgets.simpleDetailed, this);
         }
         
         
         // Display the toolbar now that we have selected the filter
         Dom.removeClass(Selector.query(".toolbar div", this.id, true), "hidden");
         
         var fnChangeFilterHandler = function MyDynamicSearches_fnChangeFilterHandler(layer, args)
         {
            var owner = args[1].anchor;
            if (owner !== null)
            {
               var filter = owner.rel,
                  filters,
                  filterObj = {};
               if (filter && filter !== "")
               {
                  args[1].stop = true;
                  filters = filter.split("|");
                  filterObj =
                  {
                     filterOwner: window.unescape(filters[0] || ""),
                     filterId: window.unescape(filters[1] || ""),
                     filterData: window.unescape(filters[2] || ""),
                     filterDisplay: window.unescape(filters[3] || "")
                  };                  
                  YAHOO.Bubbling.fire("changeFilter", filterObj);
               }
            }
            return true;
         };
         
         YAHOO.Bubbling.addDefaultAction("filter-change", fnChangeFilterHandler);
         
         // DataTable can now be rendered
         Alfresco.dashlet.MyDynamicSearches.superclass.onReady.apply(this, arguments);
         
      },
      
      /*************************
       * buildTitle
       *************************/
      buildTitle: function MyDynamicSearches_buildTitle(title){
    	  
         if(Dom.get(this.id + "-title")){
             var title = YAHOO.lang.trim(this.options.title);
             if (!title || title == null || title.length == 0){
                title = this.msg("header.title");
             }
        	 Dom.get(this.id + "-title").innerHTML = title;	 
         }
      },

          
      doShowFullscreenPage: function MyDynamicSearches_showFullscreenPage(e) {
		  
    	  var fullScreenUrl = Alfresco.constants.URL_CONTEXT + "page";
		
    	  
    	  var query = this.widgets.query.value.replace(/\\/g,"\\\\");
    	  
    	  fullScreenUrl += "/dynamic-searches?filterPath="+this.options.filterPath 
    	  			+"&filterPathView="+this.options.filterPathView
    	  			+"&maxItems="+this.options.maxItems
    	  			+"&simpleView="+this.options.simpleView
    	  			+"&regionId="+this.options.regionId
    	  			+"&siteId="+encodeURIComponent(this.options.siteId)
    	  			+"&containerId="+encodeURIComponent(this.options.containerId)
    	  			+"&sort="+this.options.sort
    	  			+"&filterTags="+this.options.filterTags
    	  			+"&filterCategories="+this.options.filterCategories
    	  			+"&sortOrder="+this.options.sortOrder
    	  			+"&query="+encodeURIComponent(query)
    	  			+"&validQueryFilter="+encodeURIComponent(this.options.validQueryFilter)
    	  			+"&validSortFilter="+encodeURIComponent(this.options.validSortFilter)
    	  			+"&title="+this.options.title
    	  			+"&rootNode="+this.options.rootNode
    	  			+"&mimetype="+encodeURIComponent(this.options.mimetype)
    	  			+"&contentType="+encodeURIComponent(this.options.contentType);
    	  
			document.location = fullScreenUrl;
			
			
		},
      
	   onConfigDynamicSearchesClick: function MyDynamicSearches_onConfigDynamicSearchesClick(e)
       {
    	  Event.stopEvent(e);
    	  var dashlet = this;
    	  
    	  var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/dynamic-searches/config/" + encodeURIComponent(this.options.componentId);
    	  
          if (!this.configDialog)
           {
        	  
              this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
               {
                  width: "50em",
                  height: "50em",
                  templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/dynamic-searches/config",
                  actionUrl: actionUrl,
                  doSetupFormsValidation: {
                	  
				     fn: function MyDynamicSearches_doSetupForm_callback(form) {
				    	 
				         //form.addValidation(this.configDialog.id + "-filterPath", Alfresco.forms.validation.mandatory, null, "keyup");
				         form.setShowSubmitStateDynamically(true, false);
				         
				         var initList = function(listId, fieldId, selectedValue) {
								Dom.get(this.configDialog.id + fieldId).value = selectedValue;
								var listEl = Dom.get(this.configDialog.id + listId);
								for(var i = 0; i < listEl.options.length; i++) {
									if(listEl.options[i].value == selectedValue) {
										listEl.options[i].selected = true;
									}
								}
							};
							
							
						 // defaultQuery vs. customQuery
				         var customQuery = document.getElementById(this.configDialog.id + "-customQuery");
					     var defaultQuery = document.getElementById(this.configDialog.id + "-defaultQuery");
					     var sortOrderList = document.getElementById(this.configDialog.id + "-sortOrder-list");
					     var contentType = document.getElementById(this.configDialog.id + "-contentType");

						 YAHOO.util.Event.addListener(Dom.get(this.id + "-configDialog-clear-customQuery-button"), "click", function(){
				        	 defaultQuery.disabled = false;				        	 
				        	 customQuery.value = "";
				         });
							
				        
// HINT: Disabling Mode 1 and 2
//				    
//				         for(var i = 0; i < defaultQuery.options.length; i++) {
//								if(defaultQuery.options[i].innerHTML == this.options.defaultQueryLabel) {
//									defaultQuery.options[i].selected = true;
//								}
//							}
				         
				         for(var i = 0; i < sortOrderList.options.length; i++) {
								if(sortOrderList.options[i].value == this.options.sortOrder) {
									sortOrderList.options[i].selected = true;
								}
							}
				         
			        	 if (this.options.customQuery != undefined && this.options.customQuery != ""){
			        		 customQuery.value = this.options.customQuery;
			        		 defaultQuery.disabled = true;
			        	 }

			        	 // live
			        	 if (Selector.query("option", defaultQuery, false).length == 0){
			        			defaultQuery.disabled = true;			        		
			        			
			        	 }else{
				    		YAHOO.util.Event.addListener(customQuery, "keyup", function(){
					    		if (this.value != ""){
					    			defaultQuery.disabled = true;					    			
					    		}else{
					    			defaultQuery.disabled = false;
					    			
					    		}
					    	});	
			        	 }	
				    	
			        	 
			        	 // restore values
			        	 //-------------------

// HINT: Disabling Mode 1 and 2
//  
			        	 //Dom.get(this.configDialog.id + "-defaultQueryLabel").value = this.options.defaultQueryLabel;
			        	 Dom.get(this.configDialog.id + "-sortOrder").value = this.options.sortOrder;			        	  
						 Dom.get(this.configDialog.id + "-title").value = this.options.title; 
						 Dom.get(this.configDialog.id + "-maxItems").value = this.options.maxItems;
				         Dom.get(this.configDialog.id + "-filterPath").value = this.options.filterPath;
				         Dom.get(this.configDialog.id + "-hideQueries").checked = (this.options.hideQueries)?'checked':'';
				         Dom.get(this.configDialog.id + "-filterPathView").innerHTML = this.options.filterPath.substr(this.options.filterPath.indexOf("|") + 1);
						 Dom.get(this.configDialog.id + "-sort").value = this.options.sort;
						 Dom.get(this.configDialog.id + "-mimetype").value = this.options.mimetype;
						 Dom.get(this.configDialog.id + "-contentType").value = this.options.contentType;
				        				         
				         this.configDialog.widgets.filterPathView = Dom.get(this.configDialog.id + "-filterPathView"); // Path
				         this.configDialog.widgets.filterPathField = Dom.get(this.configDialog.id + "-filterPath"); // NodeRef|Path
				         
				         this.configDialog.widgets.selectFilterPathButton = Alfresco.util.createYUIButton(this.configDialog, "selectFilterPath-button", this.onSelectFilterPath);
				         this.configDialog.widgets.clearFilterPathButton = Alfresco.util.createYUIButton(this.configDialog, "clearFilterPath-button", this.onClearFilterPath);
				         
				    	// tags & categorias
               		  	this.configDialog.widgets.filterCategory = new Alfresco.module.ControlWrapper(Alfresco.util.generateDomId()).setOptions({
			                  type: "category",
			                  name: "filterCategories",
			                  container: Dom.get(this.configDialog.id + "-filterCategoriesSelector"),
			                  value: this.options.filterCategories
		                 });
               		  	
               		  	this.configDialog.widgets.filterTags = new Alfresco.module.ControlWrapper(Alfresco.util.generateDomId()).setOptions({
			                  type: "tag",
			                  name: "filterTags",
			                  container: Dom.get(this.configDialog.id + "-filterTagsSelector"),
			                  value: this.options.filterTags
		                 });
               		  	
                		// cargamos wrapper para tags/categorias
               		  	this.configDialog.widgets.filterCategory.render();
               		  	this.configDialog.widgets.filterTags.render();
				     },
				     scope: this
                 },
                 onSuccess:
                 {
                    fn: function MyDynamicSearches_onConfigFeed_callback(response)
                    {
                   	// Refresh
                  	var obj = response.json;
                  	
                   	if(obj) {
                   		
	                    	// refrescamos si hace falta
	                    	if ((obj.customQuery != this.options.customQuery)){
	                    		window.location.reload();
	                    		
	                    	}else{
	                    		
	                    		// merge preferencias
								this.options = YAHOO.lang.merge(this.options, obj);
								
								
								// title
								this.buildTitle();
		                    	
		                    	// seteamosQueries
		                    	this.setQueries();
		                    	
		              	      	// hideQueries
		                    	this.setHideQueries();	                    		
	                    	}
					}
                    this.reloadDataTable();
                 },
                 scope: this
                 }
               });
            }
            this.configDialog.setOptions(
            {
               actionUrl: actionUrl,
               siteId: this.options.siteId,
               containerId: this.options.containerId
            }).show();
        
      },   
      
      onSelectFilterPath: function MyDynamicSearches_onSelectFilterPath(e, p_obj) {
    	 
    	  
          if (!this.widgets.filterPathDialog)
          {
        	  
              this.widgets.filterPathDialog = new Alfresco.module.DoclibGlobalFolder(this.id + "-selectFilterPath");
       
              var allowedViewModes =
              [
                      Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY
              ];

              
              this.widgets.filterPathDialog.setOptions(
              {
                  allowedViewModes: allowedViewModes,
                  siteId: this.options.siteId,
                  containerId: this.options.containerId,
                  title: "Configure",
                  //nodeRef: "alfresco://company/home"
                  nodeRef: this.options.rootNode
              });

              YAHOO.Bubbling.on("folderSelected", function (layer, args) {
                  var obj = args[1];
                  if (obj !== null) {
                      this.widgets.filterPathView.innerHTML = obj.selectedFolder.path;
                      this.widgets.filterPathField.value = obj.selectedFolder.nodeRef + "|" + obj.selectedFolder.path;
                      // this.widgets
                  }
              }, this);
          }

          
          
          var pathNodeRef = this.widgets.filterPathField.value.split("|")[0];

          this.widgets.filterPathDialog.setOptions({
              pathNodeRef: pathNodeRef ? new Alfresco.util.NodeRef(pathNodeRef) : null
          });

          // Show the dialog
          this.widgets.filterPathDialog.showDialog();
      },
      
      onClearFilterPath: function MyDynamicSearches_onClearFilterPath(e)
      {
          this.widgets.filterPathView.innerHTML = "";
          this.widgets.filterPathField.value = "";
      },

      /**
       * Calculate webscript parameters
       *
       * @method getParameters
       * @override
       */
      getParameters: function MyDynamicSearches_getParameters()
      {

    	  var pathNodeRef = this.options.filterPath.substr(0, this.options.filterPath.indexOf("|"));
    	  
    	  
    	  
    	  var params = "path="+pathNodeRef
    	  +"&maxItems="+this.options.maxItems
    	  +"&sort="+this.options.sort
    	  +"&sortOrder="+this.options.sortOrder    	  
    	  +"&filterTags="+this.options.filterTags
    	  +"&filterCategories="+this.options.filterCategories
    	  +"&rootNode="+this.options.rootNode
    	  +"&mimetype="+this.options.mimetype
    	  +"&contentType="+this.options.contentType;
    	  
    	  
    	  
    	  
    	  if(!this.widgets.query){    	
    		  
    		  params+= "&query="+encodeURIComponent(this.options.query);
    		  
    	  }else {
    		  
    		  params+= "&query="+encodeURIComponent(this.widgets.query.value);
    	  }
    	  
    	  return params;
    	  
      },

      /**
       * Calculate webscript parameters
       *
       * @method getParameters
       * @override
       */
      getWebscriptUrl: function MyDynamicSearches_getWebscriptUrl()
      {
	
         return Alfresco.constants.PROXY_URI + "net/zylk/nodes";
      },



      /**
       * Filter Change menu handler
       *
       * @method onFilterChange
       * @param p_sType {string} The event
       * @param p_aArgs {array}
       */
      onFilterQueryChange: function MyDynamicSearches_onFilterStatusChange(p_sType, p_aArgs)
      {
	
         var menuItem = p_aArgs[1];
         if (menuItem)
         {
            this.widgets.query.set("label", menuItem.cfg.getProperty("text"));
            this.widgets.query.value = menuItem.value;
            
           // this.services.preferences.set(this.PREFERENCES_MYDYNAMICSEARCHES_DASHLET_FILTER_QUERY, this.widgets.query.value);

            this.reloadDataTable();
         }
      },


      /**
       * Show/Hide detailed list buttongroup click handler
       *
       * @method onSimpleDetailed
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onSimpleDetailed: function MyDynamicSearches_onSimpleDetailed(e, p_obj)
      {
         this.options.simpleView = e.newValue.index === 0;
         this.services.preferences.set(this.PREFERENCES_MYDYNAMICSEARCHES_DASHLET_VIEW, this.options.simpleView);
         if (e)
         {
            Event.preventDefault(e);
         }

         this.reloadDataTable();
      },


     /**
       * Thumbnail custom datacell formatter
       *
       * @method renderCellThumbnail
       * @param elCell {object}
       * @param oRecord {object}
       * @param oColumn {object}
       * @param oData {object|string}
       */
      renderCellThumbnail: function MyDynamicSearches_renderCellThumbnail(elCell, oRecord, oColumn, oData)
      {

	
	
         var columnWidth = 40,
            record = oRecord.getData(),
            desc = "";

         if (record.isInfo)
         {
 	
            columnWidth = 52;
            desc = '<img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/help-docs-bw-32.png" />';
         }	 
         else
         {
	
            var name = record.fileName,
               extn = name.substring(name.lastIndexOf(".")),
               locn = record.location,
               nodeRef = new Alfresco.util.NodeRef(record.nodeRef),
               docDetailsUrl = "",
               folderDetailsUrl = "";
               
            
            
            if(locn.site){            	
            	docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/document-details?nodeRef=" + nodeRef.toString();
            	folderDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/folder-details?nodeRef="+ nodeRef.toString();
            }else {
            	docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "document-details?nodeRef="+ nodeRef.toString();
            	folderDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "folder-details?nodeRef="+ nodeRef.toString();
            }
            

            if (this.options.simpleView)
            {
               /**
                * Simple View
                */
            	
            	if(record.isFolder) {
            	
            		var id = this.id + '-preview-' + oRecord.getId();		
            		desc = '<span id="' + id + '" class="icon32"><a href="' + docDetailsUrl + '"><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/filetypes/generic-folder-32.png" alt="' + extn + '" title="' + $html(name) + '" /></a></span>';               // Preview tooltip
            		this.previewTooltips.push(id);
            		
            	}else {
            		var id = this.id + '-preview-' + oRecord.getId();		
            		desc = '<span id="' + id + '" class="icon32"><a href="' + folderDetailsUrl + '"><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/filetypes/' + Alfresco.util.getFileIcon(name) + '" alt="' + extn + '" title="' + $html(name) + '" /></a></span>';               // Preview tooltip
            		this.previewTooltips.push(id);
            		
            	}
		
            }
            else
            {
               /**
                * Detailed View
                */
            	columnWidth = 100;
            	if(record.isFolder) {            		
            		         
                    desc = '<span class="thumbnail"><a href="' + folderDetailsUrl + '"><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/filetypes/generic-folder-48.png" title="' + $html(name) + '" /></a></span>';
            		
            	}else {
            		var url = Alfresco.constants.PROXY_URI + "api/node/" + nodeRef.uri + "/content/thumbnails/doclib?c=queue&ph=true";              
                    desc = '<span class="thumbnail"><a href="' + docDetailsUrl + '"><img src="' + url + '" alt="' + extn + '" title="' + $html(name) + '" /></a></span>';	
            	}
            	
               
               
            }
         }

         oColumn.width = columnWidth;

         Dom.setStyle(elCell, "width", oColumn.width + "px");
         Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

         elCell.innerHTML = desc;

      },
  /**
       * Detail custom datacell formatter
       *
       * @method renderCellDetail
       * @param elCell {object}
       * @param oRecord {object}
       * @param oColumn {object}
       * @param oData {object|string}
       */
      renderCellDetail: function MyDynamicSearches_renderCellDetail(elCell, oRecord, oColumn, oData)
      {


	

         var record = oRecord.getData(),
            desc = "";

         if (record.isInfo)
         {
            desc += '<div class="empty"><h3>' + record.title + '</h3>';
            desc += '<span>' + record.description + '</span></div>';
         }
         else
         {
            var id = this.id + '-metadata-' + oRecord.getId(),
               version = "",
               description = '<span class="faded">' + this.msg("details.description.none") + '</span>',
               dateLine = "",
               locn = record.location,
               nodeRef = new Alfresco.util.NodeRef(record.nodeRef),
               docDetailsUrl = "",
               folderDetailsUrl = "",
               html = "";
               
            
            
           if(locn.site){            	
           	docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/document-details?nodeRef=" + nodeRef.toString();
           	folderDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/folder-details?nodeRef="+ nodeRef.toString();
            html = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/documentlibrary?path=" +locn.path;
           }else {
           	docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "document-details?nodeRef="+ nodeRef.toString();
           	folderDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "folder-details?nodeRef="+ nodeRef.toString();
           	html = Alfresco.constants.URL_PAGECONTEXT + "repository?path=" +locn.path;
           }
           
              // handle Repository root parent node (special store_root type - not a folder)
             
           

            // Description non-blank?
            if (record.description && record.description !== "")
            {
               description = $links($html(record.description));
            }
            // Version display
            if (record.version && record.version !== "")
            {
               version = '<span class="document-version">' + $html(record.version) + '</span>';
            }
            	
	        dateI18N = "modified";
            dateProperty = record.modifiedOn;
           
            dateLine = this.msg("details." + dateI18N + "-by", $relTime(dateProperty), $userProfile(record.modifiedByUser, record.modifiedBy, 'class="theme-color-1"'));

          
            
            if (this.options.simpleView)
            {
               /**
                * Simple View
                */

            	if(record.isFolder) {    
            		
            		desc += '<h3 class="filename simple-view"><a href="' + folderDetailsUrl + '">' + $html(record.displayName) + '</a></h3>';
                    desc += '<div class="detail"><span class="item-simple">' + dateLine + '</span></div>';  
            	}else {
            		desc += '<h3 class="filename simple-view"><a href="' + docDetailsUrl + '">' + $html(record.displayName) + '</a></h3>';
                    desc += '<div class="detail"><span class="item-simple">' + dateLine + '</span></div>';            		
            	}
            	
            	desc += '<div class="detail"><span class="item-simple">'+this.msg("label.inFolder")+'&nbsp;<a href="' + html + '">'+locn.path+'</a></span></div>'
               
            }
            else
            {
               /**
                * Detailed View
                */
            	
            	if(record.isFolder){
            		desc += '<h3 class="filename"><a href="' + folderDetailsUrl + '">' + $html(record.displayName) + '</a></h3>';
                    desc += '<div class="detail">';
                    desc +=  '<span class="item-simple">'+this.msg("label.inFolder")+'&nbsp;<a href="' + html + '">'+locn.path+'</a></span>&nbsp;<span class="item">' + dateLine + '</span>';
            		
            	}else {
            		desc += '<h3 class="filename"><a href="' + docDetailsUrl + '">' + $html(record.displayName) + '</a>' + version + '</h3>';
                    desc += '<div class="detail">';
                    desc += '<span class="item-simple">'+this.msg("label.inFolder")+'&nbsp;<a href="' + html + '">'+locn.path+'</a></span>&nbsp;<span class="item">' + dateLine + '</span>';
                    if (this.options.showFileSize)
                    {
                       desc +=    '<span class="item">' + Alfresco.util.formatFileSize(record.size) + '</span>';
                    }	
            	}
            	
            	desc += '</div>';
                desc += '<div class="detail"><span class="item">' + description + '</span></div>';                   
                
            	// Categorias
                
            	var categories = record.categories, category;
            	 desc += '<div class="detail">';
                desc += '<span class="item">'+this.msg("label.categories")+':&nbsp;';
                if (categories.length > 0)
                {
                   for (var i = 0, j = categories.length; i < j; i++)
                   {
                      category = categories[i];
                      desc += '<span class="category">' + $html(category[0]) + '</span>' + (j - i > 1 ? ", " : "");
                   }
                }
                else
                {
                   desc += '<span class="faded">'+this.msg("details.categories.none")+'</span>';
                }
                desc += '</span>';
                desc += '</div>';
                
                // Tags
                
                var tags = record.tags, tag;
                desc += '<div class="detail">';
                desc += '<span class="item">'+this.msg("label.tags")+':&nbsp;';
                if (tags.length > 0)
                {
                   for (var i = 0, j = tags.length; i < j; i++)
                   {
                      tag = tags[i];
                      desc += '<span class="tag">' + $html(tag) + '</span>' + (j - i > 1 ? ", " : "");
                   }
                }
                else
                {
                   desc += '<span class="faded">'+this.msg("details.tags.none")+'</span>';
                }
                desc += '</span>';                
                desc += '</div>';
            
            	
           }
            
            // Metadata tooltip
            this.metadataTooltips.push(id);
         }

         elCell.innerHTML = desc;
      }
      
   });
})();