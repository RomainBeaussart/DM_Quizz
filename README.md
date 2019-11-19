# Analyser

## 2. Concevoir

### Web socket

Un jeu de chat tel que DM Quizz est basé sur des flux de données en temps réel. Les web sockets répondent à ce besoin, leur but est de :

* Envoyer des messages dans le chat
* Recevoir des messages dans le chat
* Envoyer des notifications de jeu (attribution des points, annonce du vainqueur etc...)

L'utilisation de ces sockets est intimement lié au user management. Pour chaque partie, un namespace de la socket est reservé à ses joueurs. Il faut donc gérer l'inscription des joueurs de la partie au namespace.

![](./diagrams/Untitled Diagram.png)

### Récupérer des questions

Afin de proposer un quizz variée et non redondant, il est impératif de nous appuyer sur une base de données. Nous avons choisi : https://opentdb.com/. Elle permet de récupérer des questions en anglais de deux types :

* Questions à choix multiple
* Questions du type vrai / faux

### Gestion des utilisateurs

Un compte utilisateur est composé de plusieurs attributs :

* Un identifier unique (son username)
* Un mot de passe haché
* La liste des parties

Toutes ces informations sont stocké dans la base de donnée. Pour stocker les mots de passe et gérer le système d'authentification nous utiliserons bcrypt.

## 3. Planifier

Nous voulons terminer le projet avant noël. Nous avons donc réparti nortre travail en trois semaines. 

### Sprint 1

* [BACK] Authentication system 
* [BACK] Main game Loop
* [BACK] Model
* [FRONT] Model
* [FRONT] UI quizz
* [FRONT] Authentication system

### Sprint 2

* [BACK] Score system
* [BACK] Store data
* [FRONT] UI Room List
* [FRONT] UI Register / Login
* [FRONT] Score system

### Sprint 3

* [BACK] Optimisation
* [FRONT] Score tabs
* [BACK] Deployment
* [FRONT] Deployment

Fin du projet : 17 décembre 2019
