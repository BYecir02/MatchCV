const skillsMatcher = {
  getCommonSkills() {
    return [
      { name: 'JavaScript', category: 'Programmation' },
      { name: 'React', category: 'Framework/Librairie' },
      { name: 'Node.js', category: 'Framework/Librairie' },
      { name: 'Python', category: 'Programmation' },
      { name: 'Java', category: 'Programmation' },
      { name: 'PHP', category: 'Programmation' },
      { name: 'SQL', category: 'Base de données' },
      { name: 'HTML', category: 'Technique' },
      { name: 'CSS', category: 'Technique' },
      { name: 'MongoDB', category: 'Base de données' },
      { name: 'Docker', category: 'DevOps/Cloud' },
      { name: 'Git', category: 'Technique' },
      { name: 'TypeScript', category: 'Programmation' },
      { name: 'Angular', category: 'Framework/Librairie' },
      { name: 'Vue', category: 'Framework/Librairie' },
      { name: 'Express', category: 'Framework/Librairie' },
      { name: 'MySQL', category: 'Base de données' },
      { name: 'PostgreSQL', category: 'Base de données' },
      { name: 'AWS', category: 'DevOps/Cloud' },
      { name: 'Azure', category: 'DevOps/Cloud' },
      { name: 'Kubernetes', category: 'DevOps/Cloud' },
      { name: 'Redis', category: 'Base de données' },
      { name: 'GraphQL', category: 'Technique' },
      { name: 'REST API', category: 'Technique' },
      { name: 'Figma', category: 'Design/UX' },
      { name: 'Photoshop', category: 'Design/UX' },
      { name: 'Scrum', category: 'Gestion de projet' },
      { name: 'Agile', category: 'Gestion de projet' }
    ];
  },

  matchSkillsWithProfile(jobSkills, userProfile) {
    if (!userProfile || !userProfile.skills) {
      return jobSkills.map(skill => ({
        ...skill,
        userHasSkill: false,
        userProficiencyLevel: 0
      }));
    }

    return jobSkills.map(jobSkill => {
      // Recherche dans les compétences déclarées
      const userSkill = userProfile.skills.find(skill => 
        skill.skillName.toLowerCase().includes(jobSkill.skillName.toLowerCase()) ||
        jobSkill.skillName.toLowerCase().includes(skill.skillName.toLowerCase())
      );

      let userHasSkill = !!userSkill;
      let userProficiencyLevel = userSkill ? this.convertProficiencyToNumber(userSkill.proficiencyLevel) : 0;

      // Recherche dans les expériences
      if (!userHasSkill && userProfile.experience) {
        const hasInExperience = userProfile.experience.some(exp => {
          const inDescription = exp.description && exp.description.toLowerCase().includes(jobSkill.skillName.toLowerCase());
          const inTechnologies = exp.technologiesUsed && exp.technologiesUsed.some(tech => 
            tech.toLowerCase().includes(jobSkill.skillName.toLowerCase())
          );
          return inDescription || inTechnologies;
        });

        if (hasInExperience) {
          userHasSkill = true;
          userProficiencyLevel = Math.max(userProficiencyLevel, 2); // Niveau intermédiaire par défaut
        }
      }

      // Recherche dans les projets
      if (!userHasSkill && userProfile.projects) {
        const hasInProjects = userProfile.projects.some(proj => {
          const inDescription = proj.description && proj.description.toLowerCase().includes(jobSkill.skillName.toLowerCase());
          const inTechnologies = proj.technologiesUsed && proj.technologiesUsed.some(tech => 
            tech.toLowerCase().includes(jobSkill.skillName.toLowerCase())
          );
          return inDescription || inTechnologies;
        });

        if (hasInProjects) {
          userHasSkill = true;
          userProficiencyLevel = Math.max(userProficiencyLevel, 2);
        }
      }

      return {
        ...jobSkill,
        userHasSkill,
        userProficiencyLevel
      };
    });
  },

  convertProficiencyToNumber(level) {
    const mapping = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4,
      'master': 5
    };
    return mapping[level] || 2;
  },

  calculateMatchScore(matchedSkills) {
    if (!matchedSkills || matchedSkills.length === 0) {
      return { overall: 0, essential: 0 };
    }

    const totalSkills = matchedSkills.length;
    const matchingSkills = matchedSkills.filter(skill => skill.userHasSkill).length;
    
    const essentialSkills = matchedSkills.filter(skill => skill.importanceLevel === 'essential');
    const matchingEssentialSkills = essentialSkills.filter(skill => skill.userHasSkill).length;

    const overallScore = Math.round((matchingSkills / totalSkills) * 100);
    const essentialScore = essentialSkills.length > 0 ? 
      Math.round((matchingEssentialSkills / essentialSkills.length) * 100) : 100;

    return {
      overall: overallScore,
      essential: essentialScore,
      matchingSkills,
      totalSkills,
      matchingEssentialSkills,
      totalEssentialSkills: essentialSkills.length
    };
  }
};

module.exports = skillsMatcher;