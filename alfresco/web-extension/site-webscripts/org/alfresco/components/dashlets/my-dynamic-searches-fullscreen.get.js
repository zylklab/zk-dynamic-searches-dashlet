<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">

model.query = decodeURIComponent(args.query).replace(/\"/g, "\\\"");
model.validQueryFilter = decodeURIComponent(args.validQueryFilter).replace(/\"/g, "\\\"");


model.regionId = args.regionId;
model.preferences = AlfrescoUtil.getPreferences("org.alfresco.share.mydynamicsearches.dashlet." + model.regionId);

model.filterPath = args.filterPath || "";   
model.filterPathView = args.filterPathView || "";
model.prefSimpleView = args.simpleView;
model.simpleView= args.simpleView;
model.siteId = args.siteId;
model.containerId = args.containerId;
model.rootNode = args.rootNode;
model.title = args.title;
model.maxItems = args.maxItems || "20";
model.filterTags = args.filterTags || "";
model.filterCategories = args.filterCategories || "";
model.sort = args.sort || "";
model.sortOrder = args.sortOrder || "";
model.mimetype = args.mimetype;
model.contentType=args.contentType;