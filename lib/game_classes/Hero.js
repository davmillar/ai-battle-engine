class Hero {
    constructor (distanceFromTop, distanceFromLeft, name, team) {
        this.id = undefined;

        // Location
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;

        // Mines
        this.minesOwned = {};
        this.mineCount = 0;
        this.minesCaptured = 0;

        // Health
        this.health = 100;
        this.dead = false;

        // Stats
        this.diamondsEarned = 0;
        this.damageDone = 0;
        this.heroesKilled = [];
        this.lastActiveTurn = 0;
        this.gravesRobbed = 0;
        this.healthRecovered = 0;
        this.healthGiven = 0;

        // Results
        this.won = false;

        // General
        this.type = 'Hero';
        if (team === 0) {
            this.subType = 'BlackKnight';
        } else {
            this.subType = 'Adventurer';
        }
        this.team = team;

        // Personal
        this.name = name;
    }

    killedHero (otherHero) {
        this.heroesKilled.push(otherHero.id);
    }

    // Handles any situation in which the hero takes damage
    // Returns the actual amount of damage taken
    takeDamage (amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.dead = true;

            // Only return the damage actually needed
            // to kill this hero
            return amount + this.health;
        }

        // Return all the damage taken
        return amount;
    }

    // Handles any situation in which the hero heals damage
    healDamage (amount) {
        const startingHealth = this.health;

        this.health += amount;
        if (this.health > 100) {
            this.health = 100;
        }

        // Stores stats
        const healthReceived = this.health - startingHealth;
        this.healthRecovered += healthReceived;

        // Returns the amount healed
        return healthReceived;
    }

    // Take control of a diamond mine
    captureMine (diamondMine, healthCost) {
        // Make sure mine is not already owned
        if (this.minesOwned.hasOwnProperty(diamondMine.id)) {
            // If so, do nothing
        } else {
            this.takeDamage(healthCost);

            if (!this.dead) {
                // Add this mine to mines owned
                // (only stores id to prevent circular logic when saving to Mongo)
                this.minesOwned[diamondMine.id] = diamondMine.id;
                this.mineCount++;
                this.minesCaptured++;

                // Switch the diamond mine's owner to be this hero
                diamondMine.updateOwner(this);
            }
        }
    }

    // Lose control of a diamond mine
    loseMine (diamondMine) {
        if (this.minesOwned.hasOwnProperty(diamondMine.id)) {
            // Lose control of the mine
            this.mineCount--;
            delete this.minesOwned[diamondMine.id];
        }
    }

    getCode () {
        let idStr = this.id.toString();
        if (idStr.length === 1) {
            idStr = '0' + idStr;
        }
        return 'H' + idStr;
    }
}

module.exports = Hero;
