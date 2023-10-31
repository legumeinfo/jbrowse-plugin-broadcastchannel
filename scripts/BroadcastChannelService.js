// =============================================================

// Based on gcv/src/app/gene/services/inter-app-communication.service.ts

export class BroadcastChannelService {
  constructor(channel, communicate) {
    this.setChannel(channel);
    this.setCommunicate(communicate);
    if (this._communicate) this._open();
  }

  _open() {
    this._bc = new BroadcastChannel(this._channel);
    this._bc.onmessage = (message) => {
      if (message.data.type == 'deselect') return;

      if (message.data.targets) {
        // console.log(message.data.targets);
        handleBroadcastChannelMessage(message.data.targets);
      } else {
        console.log(JSON.stringify(message.data));
      }
    }
  }

  _close() {
    if (this._bc !== undefined) {
      this._bc.close();
      this._bc = undefined;
    }
  }

  getChannel() {
    return this._channel;
  }

  setChannel(channel) {
    this._channel = channel;
    if (this._communicate) {
      this._close();
      if (this._channel) {
        this._open();
      } else {
        this._communicate = false;
      }
    }
  }

  getCommunicate() {
    return this._communicate;
  }

  setCommunicate(communicate) {
    if (!(communicate && !this._channel)) {
      if (this._communicate && !communicate) {
        this._close();
      } else if (!this._communicate && communicate) {
        this._open();
      }
      this._communicate = communicate;
    }
  }

  postMessage(message) {
    if (this._communicate) {
      this._bc.postMessage(message);
    }
  }
}

// =============================================================

function handleBroadcastChannelMessage(targets) {
  var organism = targets.organism;
  var chromosome = targets.chromosome;
  var genes = targets.genes;
  var family = targets.family;
  var extent = targets.extent;
  var block = targets.block;

  var code = 0;
  if (organism) code += 1;
  if (chromosome) code += 2;
  if (genes) code += 4;
  if (family) code += 8;
  if (extent) code += 16;
  if (block) code += 32;

  if (code == 1) {
    // organism
  } else if (code == 8) {
    // gene family
  } else if (code == 12) {
    // genes + gene family
  } else if (code == 23) {
    // organism + chromosome + genes + extent
    const loc = chromosome + ':' + extent[0] + '..' + extent[1];

    // Infer genome assembly from chromosome by matching chromosome prefix to an assembly name or alias
    const regex = /^.+\.gnm\d+/;
    const chrPrefix = regex.exec(chromosome);
    var matchingAssembly = window.JBrowseSession.assemblyNames.find((a) => a == chrPrefix);
    if (!matchingAssembly) {
      const allAliases = window.JBrowseSession.assemblies.map(function(a) { return a.aliases.toJSON(); }).flat();
      matchingAssembly = allAliases.find((a) => a == chrPrefix);
    }
    if (!matchingAssembly) return;

    // Check for a LinearGenomeView with the requested chromosome,
    // and/or a LinearSyntenyView containing one. If either exists, navigate to loc.
    // If not, create a new LinearGenomeView and navigate to loc.
    var lgv = window.JBrowseSession.views.find((v) =>
      v.type == 'LinearGenomeView' && v.displayedRegions[0].refName == chromosome
    );
    var lsv = window.JBrowseSession.views.find((v) =>
      v.type == 'LinearSyntenyView' &&
        (v.views[0].displayedRegions[0].refName == chromosome ||
         v.views[1].displayedRegions[0].refName == chromosome)
    );
    const needsNewView = !(lgv || lsv);
    if (needsNewView) {
      lgv = window.JBrowseSession.addView('LinearGenomeView', {});
      // Set its desired assembly and location
      lgv.navToLocString(loc, matchingAssembly);
    } else {
      if (lgv) {
        lgv.navToLocString(loc);
      }
      if (lsv) {
        var lsv_lgv = lsv.views[0].displayedRegions[0].refName == chromosome ? lsv.views[0] : lsv.views[1];
        lsv_lgv.navToLocString(loc);
      }
    }
  }
}

// =============================================================

