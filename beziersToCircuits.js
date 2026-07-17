
function orientateLinks(bezier1, bezier2, epsilon)
{
	var xBgn, yBgn, xCtrl1, yCtrl1, xCtrl2, yCtrl2, xEnd, yEnd;
	
	// if the end-point of bezier2 is connected to the start-point of bezier1
	if ((Math.abs(bezier2[6] - bezier1[0]) < epsilon) &&
		(Math.abs(bezier2[7] - bezier1[1]) < epsilon))
	{
		// flip bezier1
		xBgn = bezier1[0]; yBgn = bezier1[1]; xCtrl1 = bezier1[2]; yCtrl1 = bezier1[3];
		xCtrl2 = bezier1[4]; yCtrl2 = bezier1[5]; xEnd = bezier1[6]; yEnd = bezier1[7];
		bezier1[0] = xEnd; bezier1[1] = yEnd; bezier1[2] = xCtrl2; bezier1[3] = yCtrl2;
		bezier1[4] = xCtrl1; bezier1[5] = yCtrl1; bezier1[6] = xBgn; bezier1[7] = yBgn;
		
		// flip bezier2
		xBgn = bezier2[0]; yBgn = bezier2[1]; xCtrl1 = bezier2[2]; yCtrl1 = bezier2[3];
		xCtrl2 = bezier2[4]; yCtrl2 = bezier2[5]; xEnd = bezier2[6]; yEnd = bezier2[7];
		bezier2[0] = xEnd; bezier2[1] = yEnd; bezier2[2] = xCtrl2; bezier2[3] = yCtrl2;
		bezier2[4] = xCtrl1; bezier2[5] = yCtrl1; bezier2[6] = xBgn; bezier2[7] = yBgn;
	}
	
	// if the start-point of bezier1 is connected to the start-point of bezier2
	if ((Math.abs(bezier1[0] - bezier2[0]) < epsilon) &&
		(Math.abs(bezier1[1] - bezier2[1]) < epsilon))
	{
		// flip bezier1
		xBgn = bezier1[0]; yBgn = bezier1[1]; xCtrl1 = bezier1[2]; yCtrl1 = bezier1[3];
		xCtrl2 = bezier1[4]; yCtrl2 = bezier1[5]; xEnd = bezier1[6]; yEnd = bezier1[7];
		bezier1[0] = xEnd; bezier1[1] = yEnd; bezier1[2] = xCtrl2; bezier1[3] = yCtrl2;
		bezier1[4] = xCtrl1; bezier1[5] = yCtrl1; bezier1[6] = xBgn; bezier1[7] = yBgn;
	}
	
	// if the end-point of bezier1 is connected to the end-point of bezier2
	if ((Math.abs(bezier1[6] - bezier2[6]) < epsilon) &&
		(Math.abs(bezier1[7] - bezier2[7]) < epsilon))
	{
		// flip bezier2
		xBgn = bezier2[0]; yBgn = bezier2[1]; xCtrl1 = bezier2[2]; yCtrl1 = bezier2[3];
		xCtrl2 = bezier2[4]; yCtrl2 = bezier2[5]; xEnd = bezier2[6]; yEnd = bezier2[7];
		bezier2[0] = xEnd; bezier2[1] = yEnd; bezier2[2] = xCtrl2; bezier2[3] = yCtrl2;
		bezier2[4] = xCtrl1; bezier2[5] = yCtrl1; bezier2[6] = xBgn; bezier2[7] = yBgn;
	}
}

function beziersToCircuits(bezierArr, epsilon)
{
	var i, j;
	var circ;
	var circuits = [];
	var idx0, idx1, idx2;
	
	// map bezier connections
	for (i=0; i < bezierArr.length; i++)
	{
		for (j=0; j < bezierArr.length; j++)
		{
			if (Math.abs(bezierArr[i][0] - bezierArr[j][0]) < epsilon)
			if (Math.abs(bezierArr[i][1] - bezierArr[j][1]) < epsilon)
			if (i != j)
			bezierArr[i][8] = j;
			
			if (Math.abs(bezierArr[i][6] - bezierArr[j][6]) < epsilon)
			if (Math.abs(bezierArr[i][7] - bezierArr[j][7]) < epsilon)
			if (i != j)
			bezierArr[i][9] = j;
			
			if (Math.abs(bezierArr[i][0] - bezierArr[j][6]) < epsilon)
			if (Math.abs(bezierArr[i][1] - bezierArr[j][7]) < epsilon)
			if (i != j)
			bezierArr[i][10] = j;
			
			if (Math.abs(bezierArr[i][6] - bezierArr[j][0]) < epsilon)
			if (Math.abs(bezierArr[i][7] - bezierArr[j][1]) < epsilon)
			if (i != j)
			bezierArr[i][11] = j;
		}
	}
	
	// find single disconnected beziers
	for (i=0; i < bezierArr.length; i++)
	if ((bezierArr[i][8] == -1) && // skip non-connecting circuits
		(bezierArr[i][9] == -1) &&
		(bezierArr[i][10] == -1) &&
		(bezierArr[i][11] == -1))
	{
		circ = [];
		circ.push(bezierArr[i]);
		circuits.push(circ);
	}
	
	// find circuits and anything else
	for (i=0; i < bezierArr.length; i++)
	{
		idx0 = 0;
		idx1 = i;
		
		if ((bezierArr[idx1][8] == -1) && // skip non-connecting circuits
			(bezierArr[idx1][9] == -1) &&
			(bezierArr[idx1][10] == -1) &&
			(bezierArr[idx1][11] == -1))
		continue;
		
		circ = [];
		while (true)
		{
			// find next index number to goto
			// make sure it does not link back
			if ((bezierArr[idx1][8] != idx0) && (bezierArr[idx1][8] != -1))
			idx2 = bezierArr[idx1][8];
			else if ((bezierArr[idx1][9] != idx0) && (bezierArr[idx1][9] != -1))
			idx2 = bezierArr[idx1][9];
			else if ((bezierArr[idx1][10] != idx0) && (bezierArr[idx1][10] != -1))
			idx2 = bezierArr[idx1][10];
			else if ((bezierArr[idx1][11] != idx0) && (bezierArr[idx1][11] != -1))
			idx2 = bezierArr[idx1][11];
			
			// if back to beginning end-point
			if ((bezierArr[idx2][8] == -1) &&
				(bezierArr[idx2][9] == -1) &&
				(bezierArr[idx2][10] == -1) &&
				(bezierArr[idx2][11] == -1))
			{
				bezierArr[idx1][8] = -1;
				bezierArr[idx1][9] = -1;
				bezierArr[idx1][10] = -1;
				bezierArr[idx1][11] = -1;
				circ.push(bezierArr[idx1]);
				break;
			}
			
			orientateLinks(bezierArr[idx1], bezierArr[idx2], epsilon);
			
			bezierArr[idx1][8] = -1;
			bezierArr[idx1][9] = -1;
			bezierArr[idx1][10] = -1;
			bezierArr[idx1][11] = -1;
			circ.push(bezierArr[idx1]);
			idx0 = idx1;
			idx1 = idx2;
			
			// if end of connections
			if ((bezierArr[idx1][8] == -1) &&
				(bezierArr[idx1][9] == -1) &&
				(bezierArr[idx1][10] == -1) &&
				(bezierArr[idx1][11] == -1))
			break;
		}
		
		circuits.push(circ);
	}
	
	return circuits;
}