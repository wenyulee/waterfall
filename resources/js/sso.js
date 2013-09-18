$(document).ready(function(e) {

		if($(document).foundation) $(document).foundation(); // Initialize foundation framework
                var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1 && navigator.userAgent.toLowerCase().indexOf("safari") > -1; //Sorry Safari users on Android
                
                if (isAndroid) {
                        if(!$("body").hasClass("android")) $("body").addClass("android");
                }
                else{
                        if(!$("body").hasClass("nonandroid")) $("body").addClass("nonandroid");
                }
                                        
		/* Append the SSO HTML into the body */
		if($().SSO.blnDebugOn) 
		{
			$().SSO.init();
		}
		
		// Set a timeout...
		setTimeout(function(){
				// Hide the address bar!
				window.scrollTo(0, 1);
			}, 0);
		});
	
	/* Make a plugin so that JS calls will be under one namespace and not mess with existing site */
	;(function( $ ) {
 		$.extend($.fn, {
			SSO: { 
				/* INTERNAL VARIABLES */
				blnDebugOn:false,
				
				version: "Voyager Innovation Inc.\nUniversal Single Sign-On Toolbar\n\nv.1.2.0",
				
				callOutTop: -400,
				
				blnSideBarOn: false,
				
				blnCallOutOn: false,
				
				//Pre-defined jQuery selectors
				objSelectors: {
						"property_name": "#VoyagerSSO .topText",
						"user_name": "#VoyagerSSO #dckLogin .userName"
					},
				
				/* CLASSES */
				clsGroup: 
				{
					groupId: "",	// String for html/css id to use for group
					groupText: "",	// String of text to display
					member: [] 		// Array of clsGroupMember
				} ,
				
				clsGroupMember:
				{
						memberId: "",		// String for html/css id to use for this member
						memberUrl: "#",		// String url for link
						memberText: "",		// String of text to display
						memberIcon: "",		// String corresponding to CSS property "background"
						memberHandler: {} 	// Function handler that will be called on click of member (only added if memberUrl is blank or "#"
				},
				
				/* MAIN FUNCTIONS */
				init: function(fnCallback) {
			
			/* HTML content for SSO toolbars */
			var strSSO_HTML_top = " \
			<div id='VoyagerSSO'> \
				<div id='topBar' class='twelve row singleShadowLine stickToTop stickToLeft'> \
					<div class='small-2 two columns'> \
						<h2 class='voyagerIcon'>Voyager</h2> \
					</div> \
					<div class='small-8 eight columns text-center'> \
						<div class='topText'>PROPERTY<!-- <span class='pullDown'> --></span></div> \
					</div> \
					<div class='small-2 two columns'></div> \
					<div class='small-12 twelve row callOutBoxContainer'> \
						<div class='small-12 large-5 five large-centered columns callOutBox'> \
							<div id='callOutBoxNick'></div> \
							<div id='callOutBox' class='four'> \
								<ul> \
									<li>SmartNet</li> \
									<li>HopTo</li> \
									<li>PBA</li> \
									<li>DoodTV</li> \
								  </ul> \
							</div> \
							<div class='clear'></div> \
						</div> \
					</div> \
					<div class='clear'></div> \
			  </div> \
			</div> \
			<div id='origContent'> \
			";
			var strSSO_HTML = " \
			</div> \
			<div id='VoyagerSSO'> \
				<div id='cover'></div> \
                <div id='sideBarContainer'>\
				<div id='sideBar'> \
					<div id='sideBarHeader' class='row stickToTop stickToLeft'> \
						<div class='small-3 three columns'> \
							<h2 class='voyagerIcon'>Voyager</h2> \
						</div> \
						<div class='small-9 nine columns'> \
							<ol class='barIcons right'> \
								<li id='notificationIcon'>Notifications</li> \
								<li id='gearIcon'>Settings</li> \
							</ol> \
						</div> \
					</div> \
					<div id='sideBarGroups' class='row stickToLeft stickToTop'> \
						<div id='grpWebService' class='small-12 twelve columns division'> \
							<h4>WEB SERVICE</h4> \
							<ul class='grpWebService'> \
								<li id='liSmartNet' class='liApps'> \
									<label><a href='http://www.smartnet.ph/' target='_top'>SmartNet</a></label> \
								</li> \
								<li id='liHopTo' class='liApps'> \
									<label><a href='http://hopto.travel/' target='_top'>HopTo</a></label> \
								</li> \
							</ul> \
						</div> \
						<div id='grpApplications' class='small-12 twelve columns division'> \
							<h4>APPLICATIONS</h4> \
							<ul class='grpApplications'> \
								<li id='liPBA' class='liApps'> \
									<label><a href='https://play.google.com/store/apps/details?id=pbaoninteraktv.client.android&hl=en' target='_top'>PinoyHoops</a></label> \
								</li> \
								<li id='liBabble' class='liApps'> \
									<label><a href='http://www.babbleim.com/' target='_top'>Babble</a></label> \
								</li> \
							</ul> \
						</div> \
					</div> \
					<div id='accountInfo' class='row stickToLeft'> \
						<div id='dckLogin' class='small-12 twelve columns deck'> \
							<div class='row'> \
							<img src='http://design-frontend.s3-website-ap-southeast-1.amazonaws.com/resources/images/profileImageFiller.png' width='60' height='60' border='0' align='left' id='profilePic'> \
							<div id='crdLogIn' class='default card'><a href='#' id='signIn' class='button signIn'>Sign In</a> <a href='#' id='signUp' class='button signUp'>Sign Up</a></div> \
							<div id='crdLoggedIn' class='card'> \
							<div class='userName'>&nbsp;</div> \
							<div class='subInfo'>account & profile</div> \
							</div> \
						</div> \
					</div> \
					<div class='clear'></div> \
				</div> \
				<div class='clear'></div> \
            	</div>\
			</div> \
			";
			
			var strBody = $("body").html();
			
			$("body").html(strSSO_HTML_top + "\n" + strBody + "\n" + strSSO_HTML);
			
			
			/* On resize of window, make sure invisible cover resizes too */
			$(window).resize($().SSO.fnResetDivSizes);
			
			/* Initialize transparent cover over the existing document */
			$("#VoyagerSSO #cover").ready(function(e) {
				$("#VoyagerSSO #cover").click(function(e) {
						$().SSO.fnHideBars();
						$().SSO.blnSideBarOn = false;
						$().SSO.blnCallOutOn = false;
				});
			});
			
			$("#VoyagerSSO .callOutBoxContainer").ready(function(e) {
				$("#VoyagerSSO .callOutBoxContainer").click(function(e) {
						$().SSO.fnHideBars();
						$().SSO.blnSideBarOn = false;
						$().SSO.blnCallOutOn = false;
				});
			});
			
			/* Initialize click event for voyager icons */
			$("#VoyagerSSO .voyagerIcon").ready(function(e) {
				$("#VoyagerSSO .voyagerIcon").click($().SSO.fnProcessVoyagerClick);
			});
			
			/* Initialize property dropdown */
			/* DISABLE PULLDOWN MENU FOR NOW 
			$(".pullDown").ready(function(e) {
				//$("#VoyagerSSO .pullDown").click($().SSO.fnProcessPulldownClick); //Let div handle click due to quirky click handling from here
				$(document).scroll(function(e){
						var callOutTopPos = $("#VoyagerSSO .callOutBox").css("top") + $(window).scrollTop();
						
						var callOutTop = $().SSO.callOutTop + $(window).scrollTop();
						
						if($().SSO.blnCallOutOn) 
						{
							$().SSO.fnHideBars();
							$().SSO.blnSideBarOn = false;
							$().SSO.blnCallOutOn = false;
						}
					});
			});	
			
			$(".topText").ready(function(e) {
				$("#VoyagerSSO .topText").click($().SSO.fnProcessPulldownClick);
			});
			
			*/
	
			if(fnCallback) fnCallback();
		},
				
				fnResetDivSizes: function()
				{
					var docHeight = $(document).height();
					var winHeight = $(window.top).height();
					var maxHeight = (docHeight>winHeight)?docHeight:winHeight;
					
					var docWidth = $(document).width();
					var winWidth = $(window.top).width();
					var maxWidth = (docWidth>winWidth)?winWidth-10:docWidth;
					
					$("#VoyagerSSO #cover").height(maxHeight).width(maxWidth);
					$("#VoyagerSSO #sideBar").height(winHeight+60);
					//$("#sideBar #sideBarGroups").height(winHeight-125);
					$("#sideBar #sideBarGroups").height(winHeight-48);
					$("#VoyagerSSO .callOutBoxContainer").width(maxWidth);
				},
				
				fnSupportsAnimation: function()
				{
					var s = document.createElement('p').style;
                                        var browserElementCheck = 'transition' in s || 'WebkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;
					/*try
					{
						var styleCheck = (JSON && JSON.stringify)?(JSON.stringify(s)!="{}"):false; // If you do not support JSON then you don't support animations
					} catch(e) {
						var styleCheck = false;
					}*/
					//var modernizrCheck = (Modernizr)?Modernizr.cssanimations:false; // Fail if Modernizr is not in library ----- IMPORTANT!!!!
					var modernizrCheck = (Modernizr)?Modernizr.csstransitions:false; // Fail if Modernizr is not in library ----- IMPORTANT!!!!
                                        
					if(!Modernizr)
					{
						console.error("Modernizr library was not loaded correctly!");
						return false;
					}
					
					//return (false || modernizrCheck || (browserElementCheck && styleCheck));
					return (false || modernizrCheck || browserElementCheck);
					
					
				},
				
				fnHideBars: function(intSpeed)
				{
					intSpeed = intSpeed?intSpeed:0;
                                        
                                        //var strAnimation = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd";
                                        var strAnimation = "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend";
					
					$("#VoyagerSSO #cover").hide();
					
					if($().SSO.fnSupportsAnimation()) 
					{
						$("#VoyagerSSO #sideBar").toggleClass("sideBarSlideIn").delay(250).hide(0);
						$("#VoyagerSSO .callOutBox").toggleClass("topBarSlideIn").delay(250).hide(0);
					}
					else 
					{
						$("#VoyagerSSO #sideBar").stop(true,true).animate({left:-400,opacity:0.0},250).hide(0);
						$("#VoyagerSSO .callOutBox").stop(true,true).animate({top:0,opacity:0.0},250).hide(0);
					}
					
					$().SSO.blnSideBarOn = false;
					$().SSO.blnCallOutOn = false;
				},
				
				fnProcessVoyagerClick: function(e) 
				{
					var sideBarLeftPos = $("#VoyagerSSO #sideBar").css("left");
					if(!$().SSO.blnSideBarOn)
					{
						/* Show sideBar and cover existing document with an invisible div */
                                                $().SSO.fnResetDivSizes();
						$("#VoyagerSSO #sideBarContainer").show(0);
						$("#VoyagerSSO #cover").show();
						$("#VoyagerSSO #sideBar").show(0).delay(250);
						
						if($().SSO.fnSupportsAnimation()) 
						{
							$("#VoyagerSSO #sideBar").toggleClass("sideBarSlideIn");
						}
						else 
						{
							$("#VoyagerSSO #sideBar").stop(true,true).show(0).animate({left:0,opacity:1.0},250);
							$("#VoyagerSSO #sideBar").css("opacity",1);
						}
						
						/* Make sure that during the click or drag, no other element is selected */
                                                $("#VoyagerSSO #sideBar").focus().select();
						  
						$().SSO.fnResetDivSizes();
						$().SSO.blnSideBarOn = true;
						$().SSO.blnCallOutOn = false;
					}
					else
					{
						/* Hide invisible div cover and sideBar */
						$().SSO.fnHideBars(250);
						$().SSO.blnSideBarOn = false;
						$().SSO.blnCallOutOn = false;
					}
				},
				
				fnProcessPulldownClick: function(e) 
				{
					var callOutTopPos = $("#VoyagerSSO .callOutBox").css("top");
					var callOutTop = $().SSO.callOutTop + $(window).scrollTop();
					if(!$().SSO.blnCallOutOn) 
					{
						/* Show dropdown and cover existing document with an invisible div */
						$().SSO.fnResetDivSizes();
						$("#VoyagerSSO #cover").show();
						$("#VoyagerSSO .callOutBoxContainer").show();
						
						if($().SSO.fnSupportsAnimation()) 
						{
							$("#VoyagerSSO .callOutBox").show().toggleClass("topBarSlideIn");
						}
						else 
						{
							//$("#VoyagerSSO .callOutBox").show().animate({top:40 + $(window).scrollTop(),opacity:1.0},"fast");
							$("#VoyagerSSO .callOutBox").stop(true,true).show(0).animate({top:40,opacity:1.0},"fast");
						}
						
						$().SSO.blnSideBarOn = false;
						$().SSO.blnCallOutOn = true;
					}
					else
					{
						/* Hide invisible div cover and dropdown */
						$().SSO.fnHideBars(250);
						$().SSO.blnCallOutOn = false;
						$().SSO.blnSideBarOn = false;
					}
				},
						
				/* SIDEBAR FUNCTIONS */
				fnBuildSideBarGroup: function(objGroupDetails)
				{
					if(objGroupDetails.groupText)
					{
						if((objGroupDetails.member) && (objGroupDetails.member instanceof Array))
						{
							
							//name the group
							var strGroup = "<div id='" + objGroupDetails.groupId + "' class='small-12 large-12 twelve columns division'>" + objGroupDetails.groupText + "</div>\n \
												<div class='doubleLine " + objGroupDetails.groupId + "'>\n \
										 	<ul>\n";
									
							//setup variables
							var strGroupMembers = "";		
							var strMember = "<li> <a href='%memberUrl%' class='liAppsLink %memberId%'>\n\
											  <div id='%memberId%' class='liApps %memberId%' style='background:%memberIcon%;'>&nbsp;</div>\n \
											  %memberText%</a></li>\n";
        					var strGroupEnd = "</div>";
							var strSpacer = "<div class='clear spacer50'></div>";
		
							if(objGroupDetails.member.length > 0) // No members, no new group
							{
								//loop through the members
								for(var ctr=0; ctr<objGroupDetails.member.length; ctr++)
								{
									var strMemberTemp = strMember;
									strMemberTemp = strMemberTemp.replace(/\%memberId\%/g,objGroupDetails.member[ctr].memberId);
									strMemberTemp = strMemberTemp.replace(/\%memberUrl\%/g,objGroupDetails.member[ctr].memberUrl);
									strMemberTemp = strMemberTemp.replace(/\%memberText\%/g,objGroupDetails.member[ctr].memberText);
									strMemberTemp = strMemberTemp.replace(/\%memberIcon\%/g,objGroupDetails.member[ctr].memberIcon);
									strGroupMembers = strGroupMembers + strMemberTemp;
								}
								
								//write the members
								strGroup = strGroup + strGroupMembers + strGroupEnd + strSpacer;
								
								//write the entire thing into #sideBarGroups
								var strSideBarGroups = $("#VoyagerSSO #sideBarGroups").html();
								strSideBarGroups = strSideBarGroups.replace(strSpacer,"");
								
								
								$("#VoyagerSSO #sideBarGroups").html(strSideBarGroups + strGroup);
								
								
								
								//attach all the member handlers
								for(var ctr=0; ctr<objGroupDetails.member.length; ctr++)
								{
									if(objGroupDetails.member[ctr].memberUrl == "" || objGroupDetails.member[ctr].memberUrl == "#")
									{
										var strMemberId = "#VoyagerSSO #sideBarGroups a." + objGroupDetails.member[ctr].memberId;
										$(strMemberId).ready(function(e) {
                                            $(strMemberId).on("click",objGroupDetails.member[ctr].memberHandler);
                                        });
									}
								}
							}
						}
						else
						{
							//Not valid input
							alert("Function Input Error: fnBuildSideBarGroup did not receive a clsGroup with a valid clsGroupMember list.");
						}
					}
					else
					{
						//Not valid input
						alert("Function Input Error: fnBuildSideBarGroup did not receive a valid input of type clsGroup.");
					}
				},
				
				fnInsertMemberIntoGroup: function(strGroupId, objMember)
				{
					var strMember = "<li> <a href='%memberUrl%' class='liAppsLink %memberId%'>\n\
									  <div id='%memberId%' class='liApps %memberId%' style='background:%memberIcon%;'>&nbsp;</div>\n \
									  %memberText%</a></li>\n";
									  
					var strList = $("." + strGroupId + " ul");
									  
					if(objMember instanceof Array)	//if objMember is an array
					{
						if(objMember.length > 0) // No members, no new group
						{
							var strMemberList = "";
							
							//loop through the members
							for(var ctr=0; ctr<objMember.length; ctr++)
							{
								var strMemberTemp = strMember;
								strMemberTemp = strMemberTemp.replace(/\%memberId\%/g,objMember[ctr].memberId);
								strMemberTemp = strMemberTemp.replace(/\%memberUrl\%/g,objMember[ctr].memberUrl);
								strMemberTemp = strMemberTemp.replace(/\%memberText\%/g,objMember[ctr].memberText);
								strMemberTemp = strMemberTemp.replace(/\%memberIcon\%/g,objMember[ctr].memberIcon);
								strMemberList = strMemberList + strMemberTemp;
							}
							
							// Insert it into the DOM
							strList.html(strList.html() + "\n" + strMemberList);
							
							//loop through the members
							for(var ctr=0; ctr<objMember.length; ctr++)
							{
								// Add the click behavior
								if(objMember[ctr].memberUrl == "" || objMember[ctr].memberUrl == "#")
								{
									var strMemberId = "#VoyagerSSO #sideBarGroups a." + objMember[ctr].memberId;
									$(strMemberId).ready(function(e) {
										$(strMemberId).on("click",objMember[ctr].memberHandler);
									});
								}
							}
						}
					}
					else	//if objMember is not an array
					{
						// Build the object
						strMember = strMember.replace(/\%memberId\%/g,objMember.memberId);
						strMember = strMember.replace(/\%memberUrl\%/g,objMember.memberUrl);
						strMember = strMember.replace(/\%memberText\%/g,objMember.memberText);
						strMember = strMember.replace(/\%memberIcon\%/g,objMember.memberIcon);
						
						// Insert it into the DOM
						strList.html(strList.html() + "\n" + strMember);
						
						// Add the click behavior
						if(objMember.memberUrl == "" || objMember.memberUrl == "#")
						{
							var strMemberId = "#VoyagerSSO #sideBarGroups a." + objMember.memberId;
							$(strMemberId).ready(function(e) {
								$(strMemberId).on("click",objMember.memberHandler);
							});
						}
					}
				},
				
				fnRemoveSideBarGroup: function(strGroupId)
				{
					var strGroupSelector = "#VoyagerSSO #sideBarGroups #" + strGroupId;
					var strGroupSelector2 = "#VoyagerSSO #sideBarGroups ." + strGroupId;
					
					$(strGroupSelector).remove();
					$(strGroupSelector2).remove();
				},
				
				fnLogin: function(strUserName, strPicSrc, fnClickHandler)
				{
					$("#VoyagerSSO #accountInfo #dckLogin").find("#crdLogIn").hide();
					$("#VoyagerSSO #accountInfo #dckLogin").find("#crdLoggedIn").show();
					if(fnClickHandler) $("#VoyagerSSO #accountInfo #dckLogin .userName").click(fnClickHandler).html(strUserName);
					
					if(strPicSrc) $("#VoyagerSSO #accountInfo #profilePic").click(fnClickHandler).attr("src",strPicSrc);
					else $("#VoyagerSSO #accountInfo #profilePic").unbind('click').attr("src","http://design-frontend.s3-website-ap-southeast-1.amazonaws.com/resources/images/profileImageFiller.png");
				},
				
				fnLogout: function()
				{
					$("#VoyagerSSO #accountInfo #dckLogin").find("#crdLogIn").show();
					$("#VoyagerSSO #accountInfo #dckLogin").find("#crdLoggedIn").hide();
					$("#VoyagerSSO #accountInfo #dckLogin .userName").unbind('click').html("");
					$("#VoyagerSSO #accountInfo #profilePic").unbind('click').attr("src","http://design-frontend.s3-website-ap-southeast-1.amazonaws.com/resources/images/profileImageFiller.png");
				},
				
				fnSetText: function(strSelector, strText)
				{
					$($().SSO.objSelectors[strSelector] || strSelector).html(strText);
				},
				
				fnSetClick: function(strSelector, fnBehavior)
				{
					
					$($().SSO.objSelectors[strSelector] || strSelector).unbind('click').click(fnBehavior);
				}
			}
		})
	 
	}(window.Zepto || window.jQuery));
	
	/* SAND BOX AREA */
	
$(document).ready(function(e) {
	/* SANDBOX AREA - delete any code below up to right before the SANDBOX END comment upon deployment */
	
	
	
	/* SANDBOX END */
});
