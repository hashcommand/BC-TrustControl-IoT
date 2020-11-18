class SLF
{
  constructor(forwardingBehaviour,nodeEnergyCurrent,lastMeasurTime,lastMeasurEnergy,currentMeasueTime,historyPValue)
  {
    this.nodeBehaviour = forwardingBehaviour;
    this.nodeCurrentEnergy = nodeEnergyCurrent;
    this.currentTime = currentMeasueTime;
    this.nodePreviousEnergy = lastMeasurEnergy;
    this.nodeLastmeasureTime = lastMeasurTime;
    this.nodehistoryPValue = historyPValue;
    this.nodeTimeDiff = this.currentTime - this.nodeLastmeasureTime;
    this.nodeEnergyDiff = this.nodeCurrentEnergy - this.nodePreviousEnergy;
    this.nodeMeanEnergy = this.nodeEnergyDiff / this.nodeTimeDiff;
    this.n =  0;
    this.p = 0;
    this.trust = 0;
  }

  calTrust() {
    if(this.nodeBehaviour>0.8 && this.nodeCurrentEnergy >  this.nodeMeanEnergy)
    {
      this.p = 1;
    } else {
      this.n = 1;
    }
    this.totalPValue = this.nodehistoryPValue + this.p;
    this.trust = this.totalPValue/(this.n+this.totalPValue+1);
    this.finalTrust = this.trust * 100;
    return this.finalTrust;
  }
}

module.exports = SLF;
