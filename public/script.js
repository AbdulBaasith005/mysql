// Main AngularJS module
var app = angular.module('universityApp', []);

// Custom Service for Student API calls
app.service('StudentService', ['$http', function ($http) {
    this.getStudents = function () {
        return $http.get('/api/students');
    };

    this.registerStudent = function (student) {
        return $http.post('/api/students', student);
    };
}]);

// Custom Filter to transform text to uppercase
app.filter('uppercase', function () {
    return function (input) {
        return input ? input.toUpperCase() : '';
    };
});

// Custom Directive to display student information
app.directive('studentCard', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        template: `
            <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                <h3>{{ data.name | uppercase }}</h3>
                <p><strong>Year:</strong> {{ data.year }}</p>
                <p><strong>Course:</strong> {{ data.course }}</p>
                <p><strong>Department:</strong> {{ data.department }}</p>
                <p><strong>Date of Birth:</strong> {{ data.dob | date:'yyyy-MM-dd' }}</p>
            </div>
        `
    };
});

// Controller for Registration
app.controller('RegistrationController', ['$scope', 'StudentService', function ($scope, StudentService) {
    $scope.student = {};

    $scope.registerStudent = function () {
        StudentService.registerStudent($scope.student)
            .then(function () {
                alert('Student registered successfully!');
                $scope.student = {}; // Reset form
            })
            .catch(function (error) {
                console.error('Error registering student:', error);
            });
    };
}]);

// Controller for Display
app.controller('DisplayController', ['$scope', 'StudentService', function ($scope, StudentService) {
    $scope.students = [];

    StudentService.getStudents()
        .then(function (response) {
            $scope.students = response.data;
        })
        .catch(function (error) {
            console.error('Error fetching students:', error);
        });
}]);
