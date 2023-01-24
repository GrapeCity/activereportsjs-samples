using System;
using System.Collections.Generic;

namespace ActiveReportsJS.ServerSide.NET.Models;

public partial class Product
{
    public long ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public long? SupplierId { get; set; }

    public long? CategoryId { get; set; }

    public string? QuantityPerUnit { get; set; }

    public byte[]? UnitPrice { get; set; }

    public long? UnitsInStock { get; set; }

    public long? UnitsOnOrder { get; set; }

    public long? ReorderLevel { get; set; }

    public string Discontinued { get; set; } = null!;

    public virtual Category? Category { get; set; }
}

public partial class Product
{
    public float? Price
    {
        get
        {
            return this.UnitPrice == null ? null : float.Parse(System.Text.Encoding.UTF8.GetString(UnitPrice));
        }
    }
}