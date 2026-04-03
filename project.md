Projet Ball N Pint
# app de gestion de bar pour centre de dek.
stack utiliser: Nextjs, drizzle, better-auth, neon, shadcn, react-hook-fom, zod, typescript
   - pour nextjs, la plus recente version, utlisant server action et/ou API, le nouveau systeme de cache
utilisation de la fine pointe pour L,integration des différent dossier du projet.
   - better auth: utilisation de tous les plugins qui peuvent etre utile, organisation etc ...

description du projet :
    - gestion de la clientèle, de leur facture, de leur carte de bière
        - un client doit avoir un nom, un email
        - chaque client doit avoir une section facture et une section carte de boisson
        - dans la section facture, je peux ajouter un produit. une fois le produit ajouter, je dois pouvoir faire payer le client avec un terminal de stype Square ou mettre la facture en attente. 
        - si j'ajoute un produit qui s'appel "Carte ...", une nouvelle carte, avec un solde de départ de 10 s'ajoute à la section carte du client
        - quand un client prend une bière et qu'il possède une carte, le nombre de produit restant diminie.
    Gestion des produits et de l'inventaire:
        - créer un produit:
            - un produit a un nom, une catégorie, un prix, produit vedette ou non
        - gestion de l'inventaire.
            - quand je suis dans la section inventaire, je veux pouvoir dire combien d'item de chaque produit j'ai. si j'achete, je veux pouvoir ajouter le # d'item au solde actuel. quand je vend, le solde doit diminuer. 
            - si j'atteint un seuil limite, je veux un alerte comme quoi je dois refaire le plein
    - section rapport:
        - sortir un rapport journalier des ventes.

pour l'authentification
    - une personnearrive sur le site pour la première, va donc creer un compte via sign-up
    - une fois creer, se connecte automatiquement. On verifies'il fait parti d'une organisation ou s'il a recu une invitation pourjoindre une organisation. si fait deja parti, diriger directement au dashboard de cette organisation. si recu une invitation, dirige versune page ou il accepte ou non l'invitation et ensuite rediriger. s'il accepte, dashboard de l'organisation, s'il refuse, il peut en creer une.
    - ensuite, si nouvelle organisation, il doit creer tout (produit, categorie, client etc)

je te reviens avec plusieurs autre details au courant de la creation.

maintenent, a toi de jouer, fait ta magie
