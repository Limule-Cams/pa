import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private responses: { [key: string]: string } = {
    "annuler rendez-vous": "Oui, vous pouvez annuler ou modifier un rendez-vous à condition de le faire au moins 24h à l'avance. Rendez-vous dans votre espace personnel > Mes activités > Détails du rendez-vous.",
    "modifier rendez-vous": "Oui, vous pouvez annuler ou modifier un rendez-vous à condition de le faire au moins 24h à l'avance. Rendez-vous dans votre espace personnel > Mes activités > Détails du rendez-vous.",
    "conseils bien-être": "Vous pouvez les consulter dans l'onglet « Conseils » de votre espace salarié.",
    "carte nfc": "Votre carte NFC est activée dès la validation de votre première réservation. Présentez-la à l'entrée des locaux de Business Care pour accéder aux événements prévus.",
    "programme abonnement": "Le programme est défini par votre employeur. Selon l'abonnement (Starter, Basic, Premium), vous avez accès à différents niveaux de services : nombre de rendez-vous, accès au chatbot, événements, etc.",
    "rendez-vous supplémentaires": "Les rendez-vous supplémentaires sont généralement à la charge du salarié. Le tarif est de 75 € pour les formules Starter et Basic, et 50 € pour Premium.",
    "informations personnelles": "Pour modifier vos informations, allez dans votre profil. Certaines données, comme votre email professionnel, ne peuvent être changées que par votre entreprise."
  };

  private keywords: { [key: string]: string } = {
    "annuler": "annuler rendez-vous",
    "modifier": "modifier rendez-vous",
    "rendez-vous": "annuler rendez-vous",
    "conseils": "conseils bien-être",
    "bien-être": "conseils bien-être",
    "carte": "carte nfc",
    "nfc": "carte nfc",
    "programme": "programme abonnement",
    "abonnement": "programme abonnement",
    "supplémentaires": "rendez-vous supplémentaires",
    "informations": "informations personnelles",
    "profil": "informations personnelles"
  };

  getResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    for (const key in this.responses) {
      if (lowerMessage.includes(key)) {
        return this.responses[key];
      }
    }

    for (const keyword in this.keywords) {
      if (lowerMessage.includes(keyword)) {
        return this.responses[this.keywords[keyword]];
      }
    }

    return "Désolé, je n'ai pas compris votre question. Voici quelques sujets que je peux traiter : annulation de rendez-vous, conseils bien-être, carte NFC, programme d'abonnement.";
  }
}
