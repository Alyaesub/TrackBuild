<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrackBuild</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/script.js" defer></script>
  <link rel="stylesheet" href="styles/css/main.css" />
</head>

<body class="bg-light py-5">

  <div class="container">
    <h1 class="mb-4 text-center">TrackBuild</h1>

    <!-- Gestion des projets -->
    <div class="mb-4">
      <h3>Gérer les projets</h3>
      <div class="input-group mb-3">
        <input type="text" id="newProjectInput" class="form-control" placeholder="Nom du projet">
        <button id="addProjectBtn" class="btn btn-success">Ajouter</button>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nom du projet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="projectTableBody">
          <!-- Projets ajoutés dynamiquement -->
        </tbody>
      </table>
    </div>

    <!-- Sélecteur de projet -->
    <div class="mb-3">
      <label for="projectSelect" class="form-label">Sélection des projets :</label>
      <select class="form-select" id="projectSelect">
        <option selected disabled>Choisis un projet</option>
        <option value=""></option>
      </select>
    </div>

    <!-- Afficheur du timer -->
    <div class="text-center my-4">
      <h2 id="timerDisplay">00:00:00</h2>
      <button id="startStopBtn" class="btn btn-primary mt-2" disabled>Démarrer</button>
    </div>

    <!-- Historique des sessions -->
    <div class="historique-sessions card p-4 shadow-sm">
      <h3 class="h3-historique mb-3">📂 Historique des sessions</h3>
      <h4 id="projectHistoryTitle" class="text-muted mb-3">Aucun projet sélectionné.</h4>

      <div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <button id="resetSessionsBtn" class="btn btn-outline-danger">🧹 Réinitialiser</button>

        <div class="d-flex flex-column">
          <label for="sortSessions" class="form-label mb-1">Trier :</label>
          <select id="sortSessions" class="form-select" style="max-width: 220px;">
            <option value="recent">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="longest">Durée la + longue</option>
            <option value="shortest">Durée la + courte</option>
          </select>
        </div>
      </div>

      <ul id="historyList" class="list-group">
        <!-- sessions -->
      </ul>
    </div>
  </div>
</body>

</html>