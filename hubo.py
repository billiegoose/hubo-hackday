#!/usr/bin/env python
# /*
# Copyright (c) 2013, William Hilton
# All rights reserved.
# */

from hubo_ach import *
import ach
import sys
import time
import math

class Hubo:
    def __init__(self):
        # Open Hubo-Ach feed-forward and feed-back (reference and state) channels
        self.s = ach.Channel(HUBO_CHAN_STATE_NAME)
        self.r = ach.Channel(HUBO_CHAN_REF_NAME)
        self.s.flush()
        self.r.flush()

        # feed-forward will now be refered to as "state"
        self.state = HUBO_STATE()

        # feed-back will now be refered to as "ref"
        self.ref = HUBO_REF()
    def __del__(self):
        # Close the connection to the channels
        self.r.close()
        self.s.close()
    def updateState(self):
        # Get the current feed-forward (state) 
        [statuss, framesizes] = self.s.get(self.state, wait=True, last=False)
    def getState(self):
        angles = [0]*42
        for i in range(0,32):
            angles[i] = self.state.joint[i].pos
        # Fingers appear to be sort of broken. Grab ref state instead.
        for i in range(32,42):
            angles[i] = self.state.joint[i].ref
        return angles
    def updateRef(self):
        self.r.put(self.ref)
    def getRef(self):
        angles = [0]*42
        for i in range(0,42):
            angles[i] = self.ref.ref[i]
        return angles
    def setRef(self,angles):
        for i in range(0,42):
            self.ref.ref[i] = angles[i]
    def gotoSafe(self, goal):
        c = 0
        looping = True
        while looping:
            c = c + 1
            # Get current joint positions
            self.updateState()
            current = self.getState()
            # Update joint angles by 0.01 radians
            ref = list(current)
            moving = False
            for i in range(0,32): # Skip fingers
                delta = goal[i] - current[i]
                if abs(delta) > 0.05:
                    #print "Delta ", i, ":= ",delta
                    ref[i] = ref[i] + math.copysign(0.05,delta)
                    moving = True
                else:
                    ref[i] = goal[i]
            # Update joint reference angles
            self.setRef(ref)
            self.updateRef()
            # See if we're done
            if not moving:
                looping = False
                break
            elif c > 500:
                looping = False
                print "Timeout!"
                break
            else:
                time.sleep(0.05)
    def savePose(self,fname):
        angles = self.getRef()
        f = open(fname,'w')
        for i in range(0,42):
            f.write('%+2.6f' % angles[i])
            if i<41:
                f.write('\t')
    def loadPose(self,fname):
        f = open(fname,'r')
        angles = map(float,f.read().split())
        return angles

