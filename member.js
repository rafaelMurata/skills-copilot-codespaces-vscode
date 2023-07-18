function skillsMember() {
    var total = 0;
    for (var i = 0; i < this.skills.length; i++) {
        total += this.skills[i].years;
    }
    return total;
}