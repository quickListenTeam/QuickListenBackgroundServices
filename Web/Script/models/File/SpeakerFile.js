/**
*@author: casa
*
*@date: 2014-08-28
*
*@note: SpeakerModel
*
*/
(function(vm){
	vm["speakerInfo"] = ko.mapping.fromJS({
		id : '',
		uniqueId : '',
		name : ''
	});
})(this.ViewModel);
$(function(){
	// ko.applyBindings(ViewModel.speakerInfo)
});