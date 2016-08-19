// Angular module, defining routes for the app
angular.module('polls', ['pollServices', 'ui.router']).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/polls');
    $stateProvider
        .state('polls', {
            url: '/polls',
            templateUrl: 'partials/list.html',
            controller: PollListCtrl
        })
        .state('new', {
            url: '/new',
            templateUrl: 'partials/new.html',
            controller: PollNewCtrl
        })
        .state('pollItem', {
            url: '/poll/:pollId',
            templateUrl: 'partials/item.html',
            controller: PollItemCtrl
        })
}]);
