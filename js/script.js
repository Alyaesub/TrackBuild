//Const générale et selecteur DOM
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");
const projectSelect = document.getElementById("projectSelect");
const startStopBtn = document.getElementById("startStopBtn");
const resetSessionsBtn = document.getElementById("resetSessionsBtn");
const sortSelect = document.getElementById("sortSessions");
const btnExport = document.getElementById("downloadChartBtn");

//variables globales
let timerInterval = null;
let startTime = null;
let isRunning = false;
let pieChart = null;
let projects = [];
let selectedProjectName = null;
