/// <summary>
/// The begin mark of keys' container frame.
/// </summary>
var tabControlBeginMark;

/// <summary>
/// The end mark of keys' container frame.
/// </summary> 
var tabControlEndMark;

/// <summary>
/// The content mark of the tab control frame.
/// </summary>
var tabControlContentMark;

/// <summary>
/// The id suffix of tab closed div.
/// </summary>
var tabClosedPrefixMark;

/// <summary>
/// All key tabs layout string will store in this parameter.
/// </summary>
var keyTabs;

/// <summary>
/// All key tabs' ID will store in this parameter.
/// </summary>
var keyIDs;

/// <summary>
/// The index of the key tabs.
/// </summary>
var keyIndex;

/// <summary>
/// A boolean value to mark whether the tab control has been created or not.
/// </summary>
var isCreatedTabCtrl;

/// <summary>
///	A two-dimensional array to store all the filter ids.
/// </summary>
var filterIDs;

/// <summary>
/// A two-dimensional array to store all the filter names.
/// </summary>
var filterNames;

/// <summary>
/// A two-dimensional array to store all the filter checked records.
/// </summary>
var filterCheckedRecords;

/// <summary>
/// Record the index of previous active key.
/// </summary>
var previousActiveKeyIndex;

/// <summary>
/// Record the index of current active key.
/// </summary>
var currentActiveKeyIndex;

/// <summary>
/// Initialize all the parameters.
/// </summary>
function Initialize()
{
	keyTabs = new Array();
	keyIDs = new Array();
	keyIndex = -1;
	isCreatedTabCtrl = false;
	filterIDs = new Array(new Array(), new Array());
	filterNames = new Array(new Array(), new Array());
	filterCheckedRecords = new Array(new Array(), new Array());
	previousActiveKeyIndex = -1;
	currentActiveKeyIndex = -1;
}

/// <summary>
/// Create a tab control. 
/// Invoke this method for the first time to create a tab control.
/// </summary>
function CreateTabControl()
{
	tabControlBeginMark = "<div id='keysContainer'>";
	tabControlEndMark = "</div>";
	tabControlContentMark="<div class='tabcontent' id='keysContent'></div>"
	
	var temp = tabControlBeginMark + tabControlEndMark + tabControlContentMark;
	document.write(temp);
	isCreatedTabCtrl = true;
}

/// <summary>
/// Add a tab to the tab control.
/// </summary>
/// <param name="keyID">The key id.</param>
/// <param name="keyName">The key name.</param>
/// <param name="fltIDs">The array of filter ids.</param>
/// <param name="fltNames">The array of filter names.</param>
function AddKeyTab(keyID, keyName, fltIDs, fltNames)
{
	if(isCreatedTabCtrl == false)
	{
		alert("Please create the tab control first!");
		return;
	}
	
	tabClosedPrefixMark = "close_";
	keyTabs[++keyIndex] = "<div id=" + keyID + " class='tab'>" +
							  "<div class='tabbox'>" + keyName + "</div>" +
							  "<div id=" + tabClosedPrefixMark + keyID + " class='closetab'>x</div>" +
					    "</div>";
	keyIDs[keyIndex] = keyID;
	$("#keysContainer").append(keyTabs[keyIndex]);
	$('.tab').removeClass('active');
	$("#" + keyID).addClass('active');
	
	filterCheckedRecords[GetKeyIndex(keyID)] = new Array(fltIDs.length);
	
	for(var i = 0; i < fltIDs.length; i++)
	{
		filterCheckedRecords[GetKeyIndex(keyID)][i] = false;
	}
	
	filterIDs[keyIndex] = fltIDs;
	filterNames[keyIndex] = fltNames;
	LoadFilterContent(keyID, fltIDs, fltNames);
	
	$(document).ready(function(){
		$("#" + tabClosedPrefixMark + keyID).hide();
	});
	
	$("#" + keyID).click(function(){
		$('.tab').removeClass('active');
		$(this).addClass('active');
		var index = GetKeyIndex($(this).attr("id"));
		LoadFilterContent(keyID, filterIDs[index], filterNames[index]);
		
		if(previousActiveKeyIndex == -1)
		{
			previousActiveKeyIndex = index;
		}
		else
		{
			previousActiveKeyIndex = currentActiveKeyIndex;
		}
		
		currentActiveKeyIndex = index;
		
		//alert("pre: " + previousActiveKeyIndex + ", cur: " + currentActiveKeyIndex);
	});
	
	$("#" + keyID).mouseenter(function(){
		$(this).children("div.closetab").fadeIn();
	});
	
	$("#" + keyID).mouseleave(function(){
		$(this).children("div.closetab").fadeOut();
	});
	
	$("#" + tabClosedPrefixMark + keyID).click(function(){
		$(this).parent().remove();
		
		if(1 == GetKeyIDsAmount())
		{
			$("#keysContent").empty();
		}
		else // Only can be this condition: 1 < GetKeyIDsAmount();
		{
			// If there has an previous tab record for watching, after deleting the current tab, the focus will move to this previous tab.
			if(previousActiveKeyIndex != -1)
			{
				$('.tab').removeClass('active');
				$("#" + keyIDs[previousActiveKeyIndex]).addClass('active');
				LoadFilterContent(keyIDs[previousActiveKeyIndex], filterIDs[previousActiveKeyIndex], filterNames[previousActiveKeyIndex]);
				
				currentActiveKeyIndex = previousActiveKeyIndex;
				previousActiveKeyIndex = -1;
			}
			else // If there has no previous tab record, the focus will move to the other tab according to the following conditions.
			{
				// New a parameter to store the index of the key tab which will be closed immediately.
				var index = GetKeyIndex($(this).parent().attr("id"));
				
				// Condition #1: If the index of the closing tab is 0, the focus will move to the next tab.
				if(index == 0)
				{
					$('.tab').removeClass('active');
					$("#" + keyIDs[index + 1]).addClass('active');
					LoadFilterContent(keyIDs[index + 1], filterIDs[index + 1], filterNames[index + 1]);
				}
				else // Condition #2: If the index of the closing tab is more than 0, the focus will move to the previous tab.
				{
					$('.tab').removeClass('active');
					$("#" + keyIDs[index - 1]).addClass('active');
					LoadFilterContent(keyIDs[index - 1], filterIDs[index - 1], filterNames[index - 1]);
				}
			}
		}
		
		RemoveKeyTab($(this).parent().attr("id"));
	});
}

/// <summary>
/// Remove a tab from the tab control.
/// </summary>
/// <param name="keyID">The key id.</param>
function RemoveKeyTab(keyID)
{
	for(var i = 0; i <= keyIndex; i++)
	{
		if(keyID == keyIDs[i])
		{
			for(var l = i; l < keyIndex; l++)
			{
				keyIDs[l] = keyIDs[l + 1];
				keyTabs[l] = keyTabs[l + 1];
				filterIDs[l] = filterIDs[l + 1];
				filterNames[l] = filterNames[l + 1];
				filterCheckedRecords[l] = filterCheckedRecords[l + 1];
			}
			
			keyIndex--;
			break;
		}
	}
}

/// <summary>
/// Load all the filters in the key.
/// </summary>
/// <param name="keyID">The key id.</param>
/// <param name="fltIDs">The array of filter ids.</param>
/// <param name="fltNames">The array of filter names.</param>
function LoadFilterContent(keyID, fltIDs, fltNames)
{
	$("#keysContent").empty();
	
	for(var i = 0; i < fltIDs.length; i++)
	{
		//alert(filterCheckedRecords[GetKeyIndex(keyID)][i]);
		var temp = "<input type='checkbox' id='" + fltIDs[i] + "'>" + fltNames[i] + "</input>";
		$("#keysContent").append(temp);
		document.getElementById(fltIDs[i]).checked = filterCheckedRecords[GetKeyIndex(keyID)][i];
		$("#" + fltIDs[i]).click(function(){
			var filterIndex = GetFilterIndex(keyID, $(this).attr("id"));
			filterCheckedRecords[GetKeyIndex(keyID)][filterIndex] = !filterCheckedRecords[GetKeyIndex(keyID)][filterIndex];
			//alert($(this).attr("id") + ":" + filterCheckedRecords[GetKeyIndex(keyID)][filterIndex] + ": " + filterIndex);
		});
	}
}

/// <summary>
/// Get the key's index through its key id.
/// </summary>
/// <param name="keyID">The key id.</param>
/// <returns>Returns the key's index.</returns>
function GetKeyIndex(keyID)
{
	var result = -1;
	
	for(var i = 0; i <= keyIndex; i++)
	{
		if(keyID == keyIDs[i])
		{
			result = i;
			break;
		}
	}
	
	return result;
}

/// <summary>
/// Get the filter's index through its filter id and its parent's key id.
/// </summary>
/// <param name="keyID">The parent's key id.</param>
/// <param name="fltID">The filter id.</param>
/// <returns>Returns the filter's index.</returns>
function GetFilterIndex(keyID, fltID)
{
	var result = -1;
	var index = GetKeyIndex(keyID);
	
	for(var i = 0; i <= filterCheckedRecords[index].length; i++)
	{
		if(fltID == filterIDs[index][i])
		{
			result = i;
			break;
		}
	}
	
	return result;
}

/// <summary>
/// Get the checked result (true or false) through its filter id and its parent's key id.
/// </summary>
/// <param name="keyID">The parent's key id.</param>
/// <param name="fltID">The filter id.</param>
/// <returns>Returns the checked result.</returns>
function GetCheckedResult(keyID, fltID)
{
	var kIndex = GetKeyIndex(keyID);
	var fIndex = GetFilterIndex(keyID, fltID);
	
	return filterCheckedRecords[kIndex][fIndex];
}

/// <summary>
/// Get all checked results from all filter checkboxes.
/// </summary>
function GetAllCheckedResults()
{
	return filterCheckedRecords;
}

/// <summary>
/// Get the amount of key ids.
/// </summary>
/// <returns>Returns the amount of the key ids.</returns>
function GetKeyIDsAmount()
{
	return keyIndex + 1;
}

/// <summary>
/// Get the key ids array;
/// </summary>
/// <returns>Returns the key ids array.</returns>
function GetKeyIDs()
{
	return keyIDs;
}

/// <summary>
/// Get the filter ids two-dimensional array.
/// </summary>
function GetFilterIDs()
{
	return filterIDs;
}

/// <summary>
/// Get the previouse key index.
/// </summary>
function GetPreviousActiveKeyIndex()
{
	return previousActiveKeyIndex;
}

/// <summary>
/// Get the current key index.
/// </summary>
function GetCurrentActiveKeyIndex()
{
	return currentActiveKeyIndex;
}



