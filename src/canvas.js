class Canvas
{
    constructor(grid,prop,lab,height,width,scale)
    {        
        this.label = lab
        this.grid = grid        
        this.property = prop
        this.height = height
        this.width = width             
        this.scale = scale        
        
        if( typeof document !== "undefined" )                       // In browser, crease a new HTML canvas-element to draw on 
        {              
            this.elem = document.createElement("canvas")  
            this.titlediv = document.createElement("div")
            this.titlediv.innerHTML = "<font size = 2>"+this.label+"</font>"
            this.canvasdiv = document.createElement("div")
            this.canvasdiv.className="grid-holder"
            this.elem.className="grid-holder"
            this.elem.width = this.width*this.scale
            this.elem.height = this.height*this.scale   
            this.canvasdiv.appendChild(this.elem)
            this.canvasdiv.appendChild(this.titlediv)
            document.getElementById("canvas_holder").appendChild(this.canvasdiv)            
            this.ctx = this.elem.getContext("2d")                            
        } 
        else 
        {   // In nodejs, use canvas package. Not yet implemented
            
		}
		
    }

    displaygrid()
    {
        let ctx = this.ctx
        let scale = this.scale
        let ncol = this.width
        let nrow = this.height
        let prop = this.property
        ctx.clearRect(0,0,scale*ncol,scale*nrow);        
                
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, ncol*scale, nrow*scale);
        var id = ctx.getImageData(0, 0,scale*ncol,scale*nrow);
        var pixels = id.data;        
        for(let i=0;i<ncol;i++)         // i are cols
        {
            for(let j=0;j<nrow;j++)     // j are rows
            {                             
                let statecols = this.grid.statecolours[prop]  
                
                if (!(prop in this.grid.grid[i][j])) continue   // Add warning?

                let value = this.grid.grid[i][j][prop]
                
                if(statecols[value] == undefined)                   // Don't draw the background state
                    continue
                let idx
                if (statecols.constructor == Object) {
                    idx = statecols[value]
                }
                else idx = statecols
                
                for(let n=0;n<scale;n++)
                {
                    for(let m=0;m<scale;m++)
                    {
                        let x = i*scale+n;
                        let y = j*scale+m;                    
                        var off = (y * id.width + x) * 4;
                        pixels[off] = idx[0];
                        pixels[off + 1] = idx[1];
                        pixels[off + 2] = idx[2];
                    }
                }
               

            }
        }
        ctx.putImageData(id, 0, 0);
    }
}



export default Canvas