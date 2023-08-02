from django.shortcuts import render
from entretien.models import Entretien

# Create your views here.

def show(request):
    entretiens= Entretien.objects.all()
    return render(request, 'entretien.html', {'entretien': entretiens})

""""
def entretien(request):
    if request.method == "POST":
        form=Entretien(request.POST)
        if form.is_valid():
            try:
                form.save()
                return redirect('/show')
            except:
                pass
    else:
        form = Entretien()
    return render(request, 'index.html', {'form': form})


def update(request,id):
    entretien= Entretien.objects.get(id=id)
    form=Entretien(request.POST, instance=entretien)
    if form.is_valid():
        form.save()
        return redirect("/show")
    return render(request, 'edit.html', {'entretien': entretien})


def delete(request,id):
    entretien= Entretien.objects.get(id=id)
    entretien.delete()
    return redirect("/show")
    
       

"""