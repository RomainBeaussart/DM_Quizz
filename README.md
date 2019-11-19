## Analyser
Aujourd'hui, on ne peut pas jouer avec ses amis en simultané, tout en aillant une conversation. C'est le but de notre projet: Permettre a l'utilisateur de jouer avec ses amis a des quizz en ligne, tout en leur permettant de discuter. <p>
Le probleme principal que nous avons est de réaliser un flux de streaming permettant a la fois de discuter, et de répondre aux questions proposées par le serveur. <p>
On peut donc décomposer en sous projet suivant:
* Envoyer des questions a l'utilisteur
* Permettre aux utilisateurs de repondre aux questions en meme temps
* Permettre aux utilisateurs de chatter en meme temps que jouer
* Calculer le temps de réponse pour chaque question
* Avoir la possibilité de créer plusieurs rooms
* Accéder a l'historique des scores (par partie et le total de toutes les parties)

## Prototype
Le projet permettra a l'utilisateur de créer un compte ou de se connecter. Il aura ainsi accès a toutes ses rooms et pourra aussi en créer une. Une fois dans une room, il peut chatter avec un ou plusieurs utilisateurs et peut démarrer un quizz. <p>
Lors du quizz, le nombre de points attribué a chauque utilisateur se fera de la manière suivante: Une fois que tout les utilisateur ont recu la question, ils ont 20 secondes pour y repondre. Plus l'utilisateur met de temps a y rempondre, moins il gagne de points. Par exemple, l'utilisateur met 8 secondes à donner la bonne réponse `20 - 8 = 12`, il aura donc gagné 12 points a cette question. Si il ne reponds pas a la question, il se voit attribuer 0 points.<p>
Une partie est composé de 15 questions. On donne la possibilité a l'utilisateur de voir le score final a la fin de la partie, mais aussi son historique des parties, soit par room, soit au total.