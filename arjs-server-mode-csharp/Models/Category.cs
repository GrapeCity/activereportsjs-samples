using System;
using System.Collections.Generic;

namespace ActiveReportsJS.ServerSide.NET.Models;

public partial class Category
{
    public long CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public string? Description { get; set; }

    public byte[]? Picture { get; set; }

    public virtual ICollection<Product> Products { get; } = new List<Product>();
}
